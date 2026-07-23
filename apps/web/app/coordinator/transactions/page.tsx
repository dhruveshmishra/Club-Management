import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '../../../lib/supabase';
import { createTransactionAction } from '../../actions/coordinator';

export const revalidate = 0;

export default async function FinancialLedgerPage() {
  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch coordinator profile and verify role is treasurer
  const { data: coord, error: coordError } = await supabase
    .from('coordinator_profiles')
    .select('*, clubs(name)')
    .eq('user_id', user.id)
    .single();

  if (coordError || !coord || coord.status !== 'approved' || coord.occupation !== 'treasurer') {
    redirect('/coordinator');
  }

  // Fetch all transactions for this club
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, coordinator_profiles(name)')
    .eq('club_id', coord.club_id)
    .order('date', { ascending: false });

  const txList = transactions || [];

  // Compute stats
  const totalIncome = txList.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const totalExpense = txList.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const handleCreateTransaction = async (formData: FormData) => {
    'use server';
    await createTransactionAction(formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {coord.clubs?.name} Financial Ledger
            </span>
          </div>
          <Link href="/coordinator" className="text-sm text-slate-400 hover:text-slate-200 transition">
            &larr; Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Add Transaction */}
        <div className="space-y-6">
          
          {/* Summary Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-sm text-slate-400">Ledger Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Income:</span>
                <span className="font-semibold text-emerald-400">+${totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Expenses:</span>
                <span className="font-semibold text-red-400">-${totalExpense.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base pt-3 border-t border-white/5">
                <span className="font-bold">Net Balance:</span>
                <span className={`font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${netBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Record Transaction Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-sm text-blue-400">Record New Transaction</h3>
            <form action={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Transaction Type</label>
                <select
                  name="type"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                >
                  <option value="income">Income (Deposit)</option>
                  <option value="expense">Expense (Payment)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  required
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Catering for coding contest"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Transaction Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition">
                Post Transaction
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Transaction List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Transaction History</h2>
          
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {txList.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {txList.map((tx: any) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/2 transition">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{tx.description}</h4>
                      <div className="text-[10px] text-slate-500">
                        Posted on: {new Date(tx.date).toLocaleDateString('en-US')} | Author: {tx.coordinator_profiles?.name}
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
