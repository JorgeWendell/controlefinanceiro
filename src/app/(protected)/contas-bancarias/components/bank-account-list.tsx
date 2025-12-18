import { getBankAccountsAction } from "../actions";
import { BankAccountCard } from "./bank-account-card";

export async function BankAccountList() {
  const bankAccounts = await getBankAccountsAction();

  if (bankAccounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Nenhuma conta bancária cadastrada.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em &quot;+ Banco&quot; para adicionar sua primeira conta.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bankAccounts.map((account) => (
        <BankAccountCard
          key={account.id}
          id={account.id}
          nomeBanco={account.nomeBanco}
          agencia={account.agencia}
          numeroConta={account.numeroConta}
          chavePix={account.chavePix}
          urlCartao={account.urlCartao}
          saldo={account.saldo}
        />
      ))}
    </div>
  );
}
