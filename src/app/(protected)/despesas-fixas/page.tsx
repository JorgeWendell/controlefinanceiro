import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DespesasFixasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Despesas Fixas</PageTitle>
          <PageDescription>
            Gerencie suas despesas fixas mensais (aluguel, internet, etc.)
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de despesas fixas e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default DespesasFixasPage;
