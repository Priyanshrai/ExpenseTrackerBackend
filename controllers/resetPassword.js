const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
require('dotenv').config();

const User = require('../models/users');
const Forgotpassword = require('../models/forgotPassword');

let defaultClient = Sib.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];


// Check if the API key is provided
if (!process.env.API_KEY) {
  console.error('Sendinblue API key is missing or invalid. Email functionality will not work.');
}

apiKey.apiKey = process.env.API_KEY;


const forgotpassword = async (req, res) => {
  try {
    // Check if the API key is missing or invalid
    if (!process.env.API_KEY) {
      throw new Error('Sendinblue API key is missing or invalid. Email functionality will not work.');
    }
    
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const id = uuid.v4();
      await user.createForgotpassword({ id, active: true });

      // Send email using Sendinblue API
      let apiInstance = new Sib.TransactionalEmailsApi();

      const sendSmtpEmail = {
        to: [{ email: email }],
        sender: {
          email: 'rai.priyansh007@email.com',
          name: 'priyansh',
        },
        transacionId: 1,
        subject: 'Reset Your Password',
        htmlContent: `<p>Hello,</p> 
                      <p>Please click the following link to reset your password:</p> 
                      <p><a href="http://localhost:5000/password/resetpassword/${id}">Reset password</a></p> 
                      <p>If you did not request a password reset, please ignore this email.</p> 
                      <p>Thank you!</p>`,
      };

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      return res.status(200).json({
        message: 'Link to reset password sent to your email',
        success: true,
      });
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong', success: false, error: err.message });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
        <script>
          function formsubmitted(e) {
            e.preventDefault();
            console.log('called');
          }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
        </form>
      </html>`);
      res.end();
    }
  });
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

    if (resetpasswordrequest) {
      const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });

      if (user) {
        // Encrypt the password
        const saltRounds = 10;
        const hash = await bcrypt.hash(newpassword, saltRounds);

        await user.update({ password: hash });
        return res.status(201).json({ message: 'Successfully updated the new password' });
      } else {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
