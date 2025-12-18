import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { BankAccountFormDialog } from "./components/bank-account-form-dialog";
import { BankAccountList } from "./components/bank-account-list";

const ContasBancariasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Contas Bancárias</PageTitle>
          <PageDescription>
            Gerencie suas contas bancárias e cartões
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <BankAccountFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <BankAccountList />
      </PageContent>
    </PageContainer>
  );
};

export default ContasBancariasPage;
