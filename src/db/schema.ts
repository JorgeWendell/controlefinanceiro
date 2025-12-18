import {
  boolean,
  date,
  decimal,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Enums
export const transactionTypeEnum = pgEnum("transaction_type", [
  "ganho",
  "meta",
  "investimento",
]);

export const transactionPaymentMethodEnum = pgEnum(
  "transaction_payment_method",
  ["debito", "credito", "transferencia_bancaria", "dinheiro", "pix", "outros"]
);

export const statusEnum = pgEnum("status", ["pago", "a_pagar", "vencido"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const bankAccountsTable = pgTable("bank_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  nomeBanco: text("nome_banco").notNull(),
  agencia: text("agencia").notNull(),
  numeroConta: text("numero_conta").notNull(),
  chavePix: text("chave_pix"),
  urlCartao: text("url_cartao"),
  saldo: numeric("saldo").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  nomeCategoria: text("nome_categoria").notNull(),
  iconCategoria: text("icon_categoria"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const dividasTable = pgTable("dividas", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataVencimento: date("data_vencimento").notNull(),
  dataPagamento: date("data_pagamento"),
  valorPago: decimal("valor_pago", { precision: 10, scale: 2 }),
  pagamentoMethod: transactionPaymentMethodEnum("pagamento_method"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const despesaFixaTable = pgTable("despesa_fixa", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  categoriaId: text("categoria_id")
    .notNull()
    .references(() => categoriesTable.id, { onDelete: "cascade" }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: statusEnum("status").notNull().default("a_pagar"),
  pagamentoMethod: transactionPaymentMethodEnum("pagamento_method"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const despesaVariavelTable = pgTable("despesa_variavel", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  categoriaId: text("categoria_id")
    .notNull()
    .references(() => categoriesTable.id, { onDelete: "cascade" }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: statusEnum("status").notNull().default("a_pagar"),
  pagamentoMethod: transactionPaymentMethodEnum("pagamento_method"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const ganhosTable = pgTable("ganhos", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  descricao: text("descricao").notNull(),
  data: date("data").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  bankAccountId: text("bank_account_id")
    .notNull()
    .references(() => bankAccountsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const metasTable = pgTable("metas", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  data: date("data").notNull(),
  bankAccountId: text("bank_account_id")
    .notNull()
    .references(() => bankAccountsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
