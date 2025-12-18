import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const InvestimentosPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Investimentos</PageTitle>
          <PageDescription>
            Gerencie seus investimentos e acompanhe os rendimentos
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de investimentos e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default InvestimentosPage;
