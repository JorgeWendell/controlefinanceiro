import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { getRelatorioAnual } from "../actions";
import { RelatorioAnualContent } from "./components/relatorio-anual-content";
import { YearFilter } from "./components/year-filter";

interface RelatorioAnualPageProps {
  searchParams: Promise<{ ano?: string }>;
}

const RelatorioAnualPage = async ({
  searchParams,
}: RelatorioAnualPageProps) => {
  const params = await searchParams;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  const data = await getRelatorioAnual(ano);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatório Anual</PageTitle>
          <PageDescription>Análise completa do ano selecionado</PageDescription>
        </PageHeaderContent>
        <YearFilter />
      </PageHeader>

      <PageContent>
        {data ? (
          <RelatorioAnualContent data={data} />
        ) : (
          <p className="text-muted-foreground">
            Não foi possível carregar os dados.
          </p>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default RelatorioAnualPage;
