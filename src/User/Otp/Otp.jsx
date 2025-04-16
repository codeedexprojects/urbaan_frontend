import React from "react";
import { Input, Typography, Button, Card } from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../StoreContext/StoreContext";
import axios from "axios";
import toast from "react-hot-toast";
import Countdown from 'react-countdown'

export function Otp() {
  const inputRefs = React.useRef([]);
  const [otp, setOtp] = React.useState(Array(6).fill(""));
  const { BASE_URL } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { phone } = location.state || {};

  // const handleComplete = () => {
  //   toast.error("Time's up! Please request a new OTP.");
  // };

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    const digits = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (digits.length === 6) {
      // If user pastes a full 6-digit OTP, distribute it
      setOtp(digits.split(""));
      digits.split("").forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
    } else {
      // If user types a single digit
      newOtp[index] = digits.charAt(0) || ""; // Ensure only one digit per field
      setOtp(newOtp);

      if (digits && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent default paste behavior
    const pastedText = event.clipboardData.getData("text").trim();
    const digits = pastedText.replace(/[^0-9]/g, "").slice(0, 6); // Extract up to 6 digits

    if (digits.length === 6) {
      setOtp(digits.split(""));
      digits.split("").forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
    }
  };


  function handleBackspace(event, index) {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      console.log(inputRefs.current[index - 1]);
      inputRefs.current[index - 1].focus();
    }
  }

  // verify otp
  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }
    try {
      const otpPayload = {
        phone: phone,
        otp: otpValue,
      }
      console.log(otpPayload)
      const response = await axios.post(`${BASE_URL}/user/auth/register/verify-otp`, otpPayload, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(response.data);
      if (response.data.token && response.data.user.userId) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem('userId', response.data.user.userId || '');
        localStorage.setItem('userCoupon', response.data.coupon);
        toast.success("Account created successfully");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className='lg:flex lg:justify-center lg:items-center min-h-screen lg:h-screen bg-userBg px-4 py-20 lg:py-0'>
        <Card color='transparent' shadow={false} className='flex items-center'>
          <Typography variant="h4" className='text-primary font-custom text-center text-4xl xl:text-3xl lg:text-3xl'>
            Verification
          </Typography>
          <Typography color="gray" className="mt-3 xl:mt-1 lg:mt-1 font-normal font-custom text-secondary text-center 
          xl:text-lg lg:text-lg text-sm">
            We have sent a verification code to <span className='font-bold'> +91 {phone}</span>
          </Typography>
          <div className="w-full max-w-sm mt-10 xl:mt-14 lg:mt-14 flex flex-col">
            <div className="my-4 flex items-center justify-center gap-2">
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <Input
                    type="number"
                    maxLength={1}
                    className="!w-10 appearance-none !border-t-blue-gray-200 text-center !text-lg placeholder:text-blue-gray-300 placeholder:opacity-100 
                    focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    containerProps={{
                      className: "!min-w-0 !w-10 !shrink-0",
                    }}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onPaste={handlePaste}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                  />
                </React.Fragment>
              ))}
            </div>
            <Typography
              variant="small"
              color="blue-gray"
              className="flex items-center justify-center gap-1 text-center font-medium font-custom"
            >
              Check text messages for your OTP
            </Typography>

            {/* <div className='flex items-center justify-center gap-2'>
              <Typography
                variant="small"
                className="text-center font-normal text-blue-gray-500 font-custom"
              >
                Didn't get the OTP ? <span className="font-light">Resend SMS in
                </span>
              </Typography>
              <div className='w-12'>
                <Countdown
                  date={Date.now() + 300000}  // 5 minutes from now
                  renderer={({ minutes, seconds }) => (
                    <p className="text-base font-bold text-primary">
                      {String(minutes).padStart(2, "0")}:
                      {String(seconds).padStart(2, "0")}
                    </p>
                  )}
                // onComplete={handleComplete}
                />
              </div>
            </div> */}

            <Button onClick={verifyOtp} className='mt-8 bg-primary text-sm font-normal capitalize font-custom w-full'>Confirm</Button>
          </div>
        </Card>
      </div>
    </>
  );
}