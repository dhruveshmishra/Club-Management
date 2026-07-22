import { createAdminServiceClient } from '../../../lib/supabase';
import { deleteTransactionAction } from '../../actions/admin';

export const revalidate = 0;

export default async function FinancialOversightPage() {
  const supabase = createAdminServiceClient();

  // Fetch all transactions
  const { data: transactions } = await (supabase as any)
    .from('transactions')
    .select('*, clubs(name), coordinator_profiles(name)')
    .order('date', { ascending: false });

  const txList = transactions || [];

  const handleDelete = async (txId: string) => {
    'use server';
    await deleteTransactionAction(txId);
  };

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Financial{' '}
          <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
            Oversight
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-2">Consolidated transaction ledger across all university clubs.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {txList.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No transactions posted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Club</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {txList.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-800">
                      {tx.clubs?.name}
                    </td>
                    <td className="p-4 text-slate-700">
                      {tx.description}
                    </td>
                    <td className="p-4 text-slate-600">
                      {tx.coordinator_profiles?.name}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className={`p-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <form action={handleDelete.bind(null, tx.id)}>
                        <button type="submit" className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[10px] font-semibold transition">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
