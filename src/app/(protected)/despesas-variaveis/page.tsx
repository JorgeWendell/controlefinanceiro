import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DespesasVariaveisPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Despesas Variáveis</PageTitle>
          <PageDescription>
            Gerencie suas despesas variáveis (compras, lazer, etc.)
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de despesas variáveis e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default DespesasVariaveisPage;
