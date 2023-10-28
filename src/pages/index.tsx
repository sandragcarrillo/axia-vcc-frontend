import { useMemo } from "react";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

/**
 * The homepage.
 */
export default function Home() {
  // Generate a unique session ID using uuid library.
  const sessionId = useMemo(() => uuidv4(), []);

  // Used to render the QR code.
  const { Canvas } = useQRCode();

  // Fetch the QR code from the server with loading + error states thanks to TanStack Query.
  const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
  } = useGenerateQrCode(sessionId);

  // Once a QR code has been loaded, check the DB every 5 seconds for a verification response.
  // That response indicates a user has successfully submitted their proof and it was verified by the server.
  const { data: verificationResponse } = useCheckForResponse(
    sessionId,
    !!qrCode
  );

  
  return (
    <main className="flex min-h-screen flex-col items-center p-5 pt-24 text-center">
      <div className="radial-gradient absolute blur-3xl rounded-full opacity-10 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 z-0 h-64 w-1/2 top-8 left-1/4 " />

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Prove that you are part of this DAO
      </h1>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-4">
      Scan the QR code below with the Polygon ID app to prove that you are part of this DAO
      </p>

      {/* Render the QR code with loading + error states */}
      {qrCodeError && (
        <p className="text-center">
          Something went wrong generating the QR code.
        </p>
      )}
      {!qrCodeError && loadingQrCode ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="flex justify-center">
          <Canvas
            text={JSON.stringify(qrCode)}
            options={{
              width: 300,
            }}
          />
        </div>
      )}

            {/* Render the verification status */}
            <p className="mt-4 text-center max-w-xl mb-4 text-xl">
        Your current status:{" "}
        {!!verificationResponse ? (
            <span className="text-green-400">Verified. Redirecting to your Member dashboard...</span>
          
        ) : (
          <span className="text-red-400">Not verified</span>

        )}
      </p>


      <Separator className="mb-4 w-1/2" />

      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
       How can I get a Verified Credential?
      </h2>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-4">
        In Axia, each DAO has a least 1 "Admin" user that can send claim links to the people the DAO selected as part of the Committee. This will allow you to claim your DAO credential, adter you get it, you can return to this page to prove your membership. If you haven't get your a claim link, please get in touch with your DAO admin.
      </p>

      <p className="leading-7 text-center max-w-2xl mt-4 mb-2">
       So far the only way to get your Verified Credential is using your Polygon ID app.
      </p>

      <p className="leading-7 text-center max-w-2xl mt-2 mb-2">
        Download the app:
      </p>

      <div className="flex justify-center space-x-4 mt-2">
        <Button
          className="bg-gradient-to-br"
          variant="secondary"
          onClick={() =>
            window.open("https://apps.apple.com/us/app/polygon-id/id1629870183")
          }
        >
          Download for iOS
        </Button>

        <Button
          className="bg-gradient-to-br"
          variant="secondary"
          onClick={() =>
            window.open(
              "https://play.google.com/store/apps/details?id=com.polygonid.wallet&pli=1"
            )
          }
        >
          Download for Android
        </Button>
      </div>

      <Separator className="my-4 w-1/2" />

     
    </main>
  );
}
