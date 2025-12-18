import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const MetasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Metas</PageTitle>
          <PageDescription>
            Defina e acompanhe suas metas financeiras
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de metas e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default MetasPage;
