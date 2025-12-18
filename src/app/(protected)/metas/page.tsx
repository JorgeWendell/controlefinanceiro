import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { MetaFormDialog } from "./components/meta-form-dialog";
import { MetaList } from "./components/meta-list";

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
        <PageActions>
          <MetaFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <MetaList />
      </PageContent>
    </PageContainer>
  );
};

export default MetasPage;
