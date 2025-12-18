import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const GanhosPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Ganhos</PageTitle>
          <PageDescription>
            Gerencie todos os seus ganhos e receitas
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de ganhos e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default GanhosPage;
