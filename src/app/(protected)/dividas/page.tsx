import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const DividasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dívidas</PageTitle>
          <PageDescription>
            Gerencie suas dívidas e acompanhe os pagamentos
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de dívidas e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default DividasPage;
