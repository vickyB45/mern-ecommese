"use client";
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { useEffect, useState } from 'react'
import verifiedImg from "@/public/assets/images/verified.gif"
import verificationFaildImg from "@/public/assets/images/verification-failed.gif"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'

const EmailVerification = async ({ params }) => {
  const { token } = await params;
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token });
        if (verificationResponse.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <Card className="max-w-[400px] mx-auto mt-10 p-4">
      <CardContent>
        {status === "loading" && (
          <div className="text-center">
            <h1 className="text-2xl font-bold my-4 text-blue-500">Please wait, verifying your email...</h1>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <Image src={verifiedImg} height={100} width={100} alt="verify" className="mx-auto" />
            <h1 className="text-2xl font-bold my-4 text-green-500">Email Verified Successfully!</h1>
            <Button asChild>
              <Link href={WEBSITE_HOME}>Continue Shopping</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <Image src={verificationFaildImg} height={100} width={100} alt="verify-failed" className="mx-auto" />
            <h1 className="text-2xl font-bold my-4 text-red-500">Email Verification Failed!</h1>
            <Button asChild>
              <Link href={WEBSITE_HOME}>Continue Shopping</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EmailVerification;
