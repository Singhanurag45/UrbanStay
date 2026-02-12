import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPayment } from "../api/paymentApi";
import { toast } from "react-toastify";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>("Confirming your payment...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setStatus("error");
      setMessage("Missing order reference.");
      return;
    }

    const verify = async () => {
      try {
        const res = await confirmPayment(orderId);
        setStatus("success");
        setMessage("Payment successful! Your booking has been created.");
       
        // Only show toast if it's not the "already confirmed" message
        if (res.message !== "Payment already confirmed") {
          toast.success(res.message || "Payment successful");
        }

        setTimeout(() => {
          navigate("/my-bookings");
        }, 1500);
      } catch (error: any) {
        console.error(error);
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "Payment could not be confirmed. If amount was deducted, please contact support.",
        );
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2
              className="mx-auto mb-4 animate-spin text-emerald-400"
              size={40}
            />
            <h1 className="text-xl font-bold text-white mb-2">
              Processing Payment
            </h1>
            <p className="text-slate-400 text-sm">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={40} />
            <h1 className="text-xl font-bold text-white mb-2">
              Payment Successful
            </h1>
            <p className="text-slate-400 text-sm mb-4">{message}</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium"
            >
              View My Bookings
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="mx-auto mb-4 text-red-400" size={40} />
            <h1 className="text-xl font-bold text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-slate-400 text-sm mb-4">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
