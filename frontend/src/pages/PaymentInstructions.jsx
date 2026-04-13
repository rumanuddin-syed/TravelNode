import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload, FiCheckCircle, FiInfo, FiCopy, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";
import BASE_URL from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const PaymentInstructions = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/booking/single/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setBooking(result.data);
      } else {
        toast.error("Failed to fetch booking details");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !transactionId) {
      toast.error("Please provide both payment proof and transaction ID");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("userId", user._id);
    formData.append("amount", booking.totalPrice);
    formData.append("transactionId", transactionId);
    formData.append("paymentProof", file);

    try {
      const res = await fetch(`${BASE_URL}/payment/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Payment proof submitted successfully!");
        navigate("/booked");
      } else {
        toast.error(result.message || "Failed to submit payment proof");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner"></div></div>;
  }

  if (!booking) {
    return <div className="text-center py-20">Booking not found.</div>;
  }

  return (
    <div className="bg-background min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <span className="section-overline">Step 2: Payment</span>
          <h1 className="text-display-md text-text-primary mt-2">Payment Instructions</h1>
          <p className="text-body-lg text-text-secondary mt-3">Please transfer the amount and upload your proof below.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Payment Details Column */}
          <div className="md:col-span-3 space-y-6">
            <div className="card p-8 bg-forest-900 text-white shadow-elevated relative overflow-hidden">
               {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-body-lg font-bold mb-6 flex items-center gap-2">
                <FiCreditCard className="text-accent" /> Bank Transfer / UPI
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                  <span className="text-caption text-forest-200 block mb-1">Company Account Name</span>
                  <span className="font-bold">TravelNode Private Limited</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-caption text-forest-200 block mb-1">Bank Name</span>
                    <span className="font-bold">HDFC Bank</span>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-caption text-forest-200 block mb-1">Account Number</span>
                    <span className="font-bold tracking-wider">50200012345678</span>
                  </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-caption text-forest-200 block mb-1">UPI ID</span>
                    <span className="font-bold">travelnode@paytm</span>
                  </div>
                  <button onClick={() => {navigator.clipboard.writeText("travelnode@paytm"); toast.info("UPI ID copied!");}} className="p-2 hover:bg-white/10 rounded-lg text-forest-200 transition-colors">
                    <FiCopy />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-body-md text-forest-200">Amount to Pay</span>
                <span className="text-display-sm font-bold text-accent">₹{booking.totalPrice}</span>
              </div>
            </div>

            <div className="card p-6 bg-sky-50 border-sky-100">
              <div className="flex gap-4">
                <FiInfo className="w-6 h-6 text-sky-600 shrink-0" />
                <div className="text-body-sm text-sky-900 leading-relaxed">
                  <p className="font-bold mb-1">Manual Verification Required</p>
                  <p>Once you upload the proof, our team will verify the transaction within 24 hours. You can track the status in your dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form Column */}
          <div className="md:col-span-2">
            <div className="card p-8 shadow-elevated sticky top-24">
              <h3 className="text-body-lg font-bold text-text-primary mb-6">Upload Proof</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="form-label mb-2 block">Transaction ID / UTR</label>
                  <input 
                    type="text" 
                    placeholder="Enter 12-digit UTR"
                    className="form-input"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label mb-2 block">Payment Screenshot</label>
                  <div className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-10 px-4 transition-all duration-300 ${file ? 'border-success bg-forest-50/30' : 'border-border-default hover:border-cta bg-background'}`}>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {file ? (
                      <>
                        <FiCheckCircle className="w-10 h-10 text-success mb-3" />
                        <span className="text-body-sm font-medium text-forest-800 text-center line-clamp-1">{file.name}</span>
                        <button type="button" onClick={() => setFile(null)} className="text-caption text-danger mt-2 hover:underline">Remove</button>
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-10 h-10 text-text-muted mb-3" />
                        <span className="text-body-sm font-medium text-text-secondary text-center">Click or drag image</span>
                        <span className="text-caption text-text-muted mt-1 uppercase">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full btn-cta-lg flex items-center justify-center gap-2 mt-4"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
