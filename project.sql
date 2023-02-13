BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "products" (
	"id_product" integer,
	"description" text,
	"price"	numeric,
	"height" numeric,
	"width"	numeric,
	"length" numeric,
	"weight" numeric,
	"currency" TEXT DEFAULT 'BRL'
);

CREATE TABLE IF NOT EXISTS "coupons" (
	"code" text,
	"percentage" numeric,
	"status" boolean DEFAULT true
);

INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (1,'A',1000,30,100,10,3,'BRL');
INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (2,'B',5000,50,50,50,22,'BRL');
INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (3,'C',30,10,10,10,0.9,'BRL');
INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (4,'D',20,12,10,-15,0.9,'BRL');
INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (4,'D',30,10,-10,10,0.9,'BRL');
INSERT INTO "products" ("id_product","description","price","height","width","length","weight","currency") VALUES (5,'A',1000,30,100,10,3,'USD');

INSERT INTO "coupons" ("code","percentage","status") VALUES ('VALE20',20,1);
INSERT INTO "coupons" ("code","percentage","status") VALUES ('VALE30',30,0);

CREATE TABLE IF NOT EXISTS "order" (
	id_order text,
	cpf text,
	code text,
	total numeric,
	freight numeric
);

CREATE TABLE IF NOT EXISTS "item" (
	id_order text,
	id_product integer,
	price numeric,
	quantity integer
);
COMMIT;
