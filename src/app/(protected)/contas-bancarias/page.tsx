import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

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
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de contas bancárias e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default ContasBancariasPage;
