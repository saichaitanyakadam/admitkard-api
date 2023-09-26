const express = require('express');
const cors=require("cors")
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 3500;


app.use(express.json());
app.use(cors())


const accountSid = 'AC44b0dc0d3b4647597ab9a322b357edc2';
const authToken = '4caea753919191c6af60aaff41b7a04c';
const twilioPhoneNumber = '+15097745126';
const client = new twilio(accountSid, authToken);

const otps = {};


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to the user's phone number
app.post('/api/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();
  otps[phoneNumber] = otp;

  try {
    await client.messages.create({
      to: phoneNumber,
      from: twilioPhoneNumber,
      body: `Your OTP is: ${otp}`,
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedOtp = otps[phoneNumber];

  if (storedOtp && otp === storedOtp) {
    res.json({ message: 'OTP is valid' });
  } else {
    res.status(401).json({error:"Invalid OTP"});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
