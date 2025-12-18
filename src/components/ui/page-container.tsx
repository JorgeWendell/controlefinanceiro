export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4 p-4 md:space-y-6 md:p-6">{children}</div>;
};

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-center">
      {children}
    </div>
  );
};

export const PageHeaderCenter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-start md:justify-center">
      {children}
    </div>
  );
};

export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full space-y-1">{children}</div>;
};

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-xl font-semibold md:text-2xl">{children}</h1>;
};

export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-muted-foreground text-xs md:text-sm">{children}</p>;
};

export const PageActions = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-start gap-2 md:justify-end">
      {children}
    </div>
  );
};

export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4 md:space-y-6">{children}</div>;
};
