import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { CategoriaFormDialog } from "./components/categoria-form-dialog";
import { CategoriaList } from "./components/categoria-list";

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
        <PageActions>
          <CategoriaFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <CategoriaList />
      </PageContent>
    </PageContainer>
  );
};

export default CategoriasPage;
