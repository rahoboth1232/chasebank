import { useState } from "react";
import { useCreateTransfer, useTransferData } from "../hooks/useTransfer";

function Alert({ type, message }) {
  const styles =
    type === "success"
      ? "bg-green-50 text-green-800 border border-green-200"
      : "bg-red-50 text-red-800 border border-red-200";

  return (
    <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${styles}`}>
      {message}
    </div>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold tracking-wide uppercase text-slate-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function TransferForm() {
  const [alert, setAlert] = useState(null);

  const { data, isLoading } = useTransferData();
  console.log(data)
  const transferMutation = useCreateTransfer();

  const [form, setForm] = useState({
    action: "internal",
    from_account: "",
    to_account: "",
    amount: "",
    memo: "",
    date: ""
  });

  if (isLoading) return <p>Loading...</p>;

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    transferMutation.mutate(form, {
      onSuccess: () => {
        setAlert({
          type: "success",
          message: "Transfer request submitted successfully"
        });

        setForm({
          action: "internal",
          from_account: "",
          to_account: "",
          amount: "",
          memo: "",
          date: ""
        });
      },

      onError: (err) => {
        setAlert({
          type: "error",
          message:
            err?.response?.data?.error || "Transfer failed"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4">
      <div className="w-full max-w-5xl">

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 shadow-sm p-8">

            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Transfer Details
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">

              {/* FROM ACCOUNT */}
              <Field label="Transfer From" htmlFor="from_account">
                <select
                  id="from_account"
                  value={form.from_account}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select account</option>

                  {data.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_number} — ${acc.balance} ({acc.account_type})
                    </option>
                  ))}
                </select>
              </Field>

              {/* TO ACCOUNT */}
              <Field label="Transfer To" htmlFor="to_account">
                <select
                  id="to_account"
                  value={form.to_account}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select account</option>

                  {data.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_number} — ${acc.balance} ({acc.account_type})
                    </option>
                  ))}
                </select>
              </Field>

              {/* DATE */}
              <Field label="Date" htmlFor="date">
                <input
                  type="date"
                  id="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </Field>

              {/* AMOUNT */}
              <Field label="Amount" htmlFor="amount">
                <input
                  type="number"
                  id="amount"
                  value={form.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={inputClass}
                  required
                />
              </Field>

              {/* MEMO */}
              <Field label="Memo" htmlFor="memo">
                <input
                  type="text"
                  id="memo"
                  value={form.memo}
                  onChange={handleChange}
                  placeholder="Optional note"
                  className={inputClass}
                />
              </Field>

            </div>

            <div className="h-px bg-slate-100 my-6" />

            <div className="flex justify-end gap-3">

              <button
                type="submit"
                disabled={transferMutation.isPending}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
              >
                {transferMutation.isPending ? "Processing..." : "Next →"}
              </button>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}