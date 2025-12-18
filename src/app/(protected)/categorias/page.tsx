import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

const CategoriasPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Categorias</PageTitle>
          <PageDescription>
            Gerencie as categorias de suas transações
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <p className="text-muted-foreground">
          Em breve: lista de categorias e formulário de cadastro
        </p>
      </PageContent>
    </PageContainer>
  );
};

export default CategoriasPage;
