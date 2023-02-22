
-- PostgreSQL database dump

CREATE TABLE luxonis_posts (
    id integer NOT NULL,
    title text,
    url text,
    images text[]
);

CREATE SEQUENCE id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 89576567
    CACHE 1;

ALTER SEQUENCE id_seq OWNED BY luxonis_posts.id;
ALTER TABLE ONLY luxonis_posts 
    ALTER COLUMN id SET DEFAULT nextval('public.id_seq'::regclass);
ALTER TABLE ONLY luxonis_posts
    ADD CONSTRAINT id PRIMARY KEY (id);

/*
INSERT INTO luxonis_posts VALUES (
    1, 
    'For sale apartment 2+kt 51 m²', 
    'https://www.sreality.cz/en/detail/sale/flat/2+kt/praha-letnany-tupolevova/1134425164', 
    '{"https://d18-a.sdn.cz/d_18/c_img_QO_Kr/dx0Msb.jpeg?fl=res,400,300,3|shr,,20|jpg,90","https://d18-a.sdn.cz/d_18/c_img_QJ_Jg/GlEBLFc.jpeg?fl=res,400,300,3|shr,,20|jpg,90","https://d18-a.sdn.cz/d_18/c_img_QI_Ja/d4PBKmq.jpeg?fl=res,400,300,3|shr,,20|jpg,90","https://d18-a.sdn.cz/d_18/c_img_QO_Kr/hO5Msc.jpeg?fl=res,400,300,3|shr,,20|jpg,90","https://d18-a.sdn.cz/d_18/c_img_QP_Ku/3OUflt.jpeg?fl=res,400,300,3|shr,,20|jpg,90"}'
);
*/