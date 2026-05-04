--
-- PostgreSQL database dump
--

\restrict rGcGgBKJcMEhtVQHK8E1B4fQP0DttIVKuqnsCswQ7T39E2rwAOZX8VvQC8JzKYX

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: status; Type: TYPE; Schema: public; Owner: rosiegeisler
--

CREATE TYPE public.status AS ENUM (
    'Reserved',
    'Paid',
    'Canceled'
);


ALTER TYPE public.status OWNER TO rosiegeisler;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.booking (
    bookingid integer NOT NULL,
    roomid integer NOT NULL,
    startdate date NOT NULL,
    enddate date NOT NULL,
    bookingprice numeric(10,2) NOT NULL,
    guestid integer NOT NULL,
    checkedin boolean NOT NULL,
    checkedout boolean NOT NULL,
    ready boolean NOT NULL,
    housekeeper integer,
    status public.status DEFAULT 'Reserved'::public.status NOT NULL,
    CONSTRAINT booking_bookingprice_check CHECK ((bookingprice > 0.0)),
    CONSTRAINT booking_check CHECK ((enddate >= startdate)),
    CONSTRAINT booking_startdate_check CHECK ((startdate >= '2026-01-01'::date))
);


ALTER TABLE public.booking OWNER TO rosiegeisler;

--
-- Name: booking_bookingid_seq; Type: SEQUENCE; Schema: public; Owner: rosiegeisler
--

CREATE SEQUENCE public.booking_bookingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.booking_bookingid_seq OWNER TO rosiegeisler;

--
-- Name: booking_bookingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rosiegeisler
--

ALTER SEQUENCE public.booking_bookingid_seq OWNED BY public.booking.bookingid;


--
-- Name: frontworker; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.frontworker (
    staffid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.frontworker OWNER TO rosiegeisler;

--
-- Name: guest; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.guest (
    guestid integer NOT NULL,
    guestname character varying(100) NOT NULL,
    phonenumber character varying(20) NOT NULL,
    age smallint,
    loyaltymember boolean DEFAULT false NOT NULL,
    CONSTRAINT guest_age_check CHECK ((age >= 18))
);


ALTER TABLE public.guest OWNER TO rosiegeisler;

--
-- Name: guest_guestid_seq; Type: SEQUENCE; Schema: public; Owner: rosiegeisler
--

CREATE SEQUENCE public.guest_guestid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.guest_guestid_seq OWNER TO rosiegeisler;

--
-- Name: guest_guestid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rosiegeisler
--

ALTER SEQUENCE public.guest_guestid_seq OWNED BY public.guest.guestid;


--
-- Name: housekeeper; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.housekeeper (
    staffid integer NOT NULL,
    monavail boolean DEFAULT false,
    tuesavail boolean DEFAULT false,
    wedavail boolean DEFAULT false,
    thursdavail boolean DEFAULT false,
    friavail boolean DEFAULT false,
    satavail boolean DEFAULT false,
    sunavail boolean DEFAULT false
);


ALTER TABLE public.housekeeper OWNER TO rosiegeisler;

--
-- Name: location; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.location (
    buildingid integer NOT NULL,
    amenities text,
    address text NOT NULL,
    phonenumber character varying(20) NOT NULL,
    locationname text NOT NULL
);


ALTER TABLE public.location OWNER TO rosiegeisler;

--
-- Name: location_buildingid_seq; Type: SEQUENCE; Schema: public; Owner: rosiegeisler
--

CREATE SEQUENCE public.location_buildingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_buildingid_seq OWNER TO rosiegeisler;

--
-- Name: location_buildingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rosiegeisler
--

ALTER SEQUENCE public.location_buildingid_seq OWNED BY public.location.buildingid;


--
-- Name: room; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.room (
    roomid integer NOT NULL,
    price numeric(10,2) NOT NULL,
    bedcount smallint NOT NULL,
    roomtype text NOT NULL,
    roomnumber text NOT NULL,
    petfriendly boolean NOT NULL,
    accessible boolean NOT NULL,
    smokefree boolean NOT NULL,
    buildingid integer NOT NULL,
    CONSTRAINT room_bedcount_check CHECK ((bedcount > 0)),
    CONSTRAINT room_price_check CHECK ((price > (0)::numeric))
);


ALTER TABLE public.room OWNER TO rosiegeisler;

--
-- Name: room_roomid_seq; Type: SEQUENCE; Schema: public; Owner: rosiegeisler
--

CREATE SEQUENCE public.room_roomid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_roomid_seq OWNER TO rosiegeisler;

--
-- Name: room_roomid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rosiegeisler
--

ALTER SEQUENCE public.room_roomid_seq OWNED BY public.room.roomid;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: rosiegeisler
--

CREATE TABLE public.staff (
    staffid integer NOT NULL,
    name character varying(100) NOT NULL,
    phonenumber character varying(20) NOT NULL,
    buildingid integer NOT NULL
);


ALTER TABLE public.staff OWNER TO rosiegeisler;

--
-- Name: staff_staffid_seq; Type: SEQUENCE; Schema: public; Owner: rosiegeisler
--

CREATE SEQUENCE public.staff_staffid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.staff_staffid_seq OWNER TO rosiegeisler;

--
-- Name: staff_staffid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rosiegeisler
--

ALTER SEQUENCE public.staff_staffid_seq OWNED BY public.staff.staffid;


--
-- Name: booking bookingid; Type: DEFAULT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.booking ALTER COLUMN bookingid SET DEFAULT nextval('public.booking_bookingid_seq'::regclass);


--
-- Name: guest guestid; Type: DEFAULT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.guest ALTER COLUMN guestid SET DEFAULT nextval('public.guest_guestid_seq'::regclass);


--
-- Name: location buildingid; Type: DEFAULT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.location ALTER COLUMN buildingid SET DEFAULT nextval('public.location_buildingid_seq'::regclass);


--
-- Name: room roomid; Type: DEFAULT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.room ALTER COLUMN roomid SET DEFAULT nextval('public.room_roomid_seq'::regclass);


--
-- Name: staff staffid; Type: DEFAULT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.staff ALTER COLUMN staffid SET DEFAULT nextval('public.staff_staffid_seq'::regclass);


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.booking (bookingid, roomid, startdate, enddate, bookingprice, guestid, checkedin, checkedout, ready, housekeeper, status) FROM stdin;
58109	24	2026-02-07	2026-02-18	1141.25	3120	t	t	t	\N	Paid
31312	8	2026-09-16	2026-09-29	1285.70	4538	f	f	f	\N	Reserved
64383	78	2026-02-15	2026-02-23	1004.40	3295	t	t	t	\N	Paid
68088	79	2026-10-08	2026-10-21	1465.10	2545	f	f	f	\N	Canceled
67096	51	2026-06-25	2026-07-09	1134.00	3329	f	f	f	\N	Canceled
63719	29	2026-10-06	2026-10-11	450.00	1565	f	f	f	\N	Reserved
41114	95	2026-10-26	2026-11-08	1495.00	2881	f	f	f	\N	Reserved
10293	17	2026-10-29	2026-11-02	432.00	2827	f	f	f	\N	Reserved
27679	49	2026-07-14	2026-07-26	912.00	3460	f	f	f	\N	Reserved
20176	43	2026-02-13	2026-02-23	1175.00	1243	t	t	t	\N	Paid
66452	38	2026-12-13	2026-12-22	879.75	3309	f	f	f	\N	Reserved
63290	14	2026-07-27	2026-08-06	1161.00	2157	f	f	f	\N	Reserved
69262	78	2026-04-02	2026-04-05	376.65	1274	t	t	t	\N	Paid
31897	13	2026-10-18	2026-10-23	529.00	1211	f	f	f	\N	Reserved
91217	95	2026-12-17	2026-12-26	1035.00	1618	f	f	f	\N	Reserved
14392	74	2026-06-05	2026-06-08	311.85	2117	f	f	f	\N	Canceled
52477	20	2026-03-26	2026-03-29	318.75	2202	t	t	t	\N	Paid
94152	47	2026-03-13	2026-03-18	481.25	3361	t	t	t	\N	Paid
59212	87	2026-10-03	2026-10-04	125.00	1509	f	f	f	\N	Reserved
72139	42	2026-09-15	2026-09-27	1409.40	2458	f	f	f	\N	Canceled
33805	69	2026-07-07	2026-07-13	534.00	2537	f	f	f	\N	Reserved
27101	34	2026-08-25	2026-09-05	1366.20	1473	f	f	f	\N	Canceled
42006	63	2026-01-05	2026-01-10	518.75	1400	t	t	t	\N	Paid
58144	46	2026-03-02	2026-03-16	1050.00	4857	t	t	t	\N	Paid
2621	57	2027-01-03	2027-01-12	1093.50	3215	f	f	f	\N	Canceled
78403	78	2026-07-23	2026-07-27	502.20	4477	f	f	f	\N	Reserved
83659	63	2026-01-10	2026-01-19	933.75	3160	t	t	t	\N	Paid
46506	21	2026-12-01	2026-12-13	1571.40	3295	f	f	f	\N	Reserved
96065	62	2026-01-22	2026-01-31	1035.00	2988	t	t	t	\N	Paid
54495	69	2026-05-05	2026-05-07	178.00	1053	f	f	f	\N	Reserved
76863	34	2026-11-26	2026-12-03	869.40	2692	f	f	f	\N	Reserved
51189	27	2026-01-01	2026-01-08	772.80	3142	t	t	t	\N	Paid
4956	17	2026-05-21	2026-05-26	540.00	4739	f	f	f	\N	Reserved
64309	38	2026-01-13	2026-01-24	1075.25	4989	t	t	t	\N	Paid
53036	63	2026-09-06	2026-09-20	1452.50	3676	f	f	f	\N	Reserved
83418	29	2026-12-23	2027-01-03	990.00	2627	f	f	f	\N	Reserved
65356	33	2026-07-19	2026-07-23	437.00	4082	f	f	f	\N	Reserved
70181	21	2026-09-10	2026-09-11	130.95	2602	f	f	f	\N	Reserved
64903	18	2026-11-09	2026-11-15	737.10	2763	f	f	f	\N	Canceled
29573	45	2026-10-03	2026-10-10	805.00	3058	f	f	f	\N	Reserved
36546	7	2026-06-09	2026-06-11	225.40	3733	f	f	f	\N	Reserved
80869	8	2026-11-25	2026-12-04	890.10	4324	f	f	f	\N	Reserved
53380	75	2026-11-08	2026-11-18	1242.00	2942	f	f	f	\N	Reserved
24605	74	2026-01-23	2026-01-31	831.60	1180	t	t	t	\N	Paid
2463	69	2026-08-29	2026-09-12	1246.00	1080	f	f	f	\N	Reserved
55753	68	2026-01-27	2026-02-03	732.55	1022	t	t	t	\N	Paid
6063	34	2026-09-27	2026-10-02	621.00	3365	f	f	f	\N	Reserved
93263	11	2026-09-15	2026-09-21	572.70	4752	f	f	f	\N	Reserved
21451	79	2026-07-22	2026-07-24	225.40	3915	f	f	f	\N	Reserved
9653	98	2026-10-20	2026-10-23	340.20	2420	f	f	f	\N	Canceled
63181	45	2026-12-18	2026-12-26	920.00	3110	f	f	f	\N	Reserved
40089	49	2026-04-27	2026-05-03	456.00	4255	t	t	t	\N	Paid
76914	65	2026-01-12	2026-01-15	405.00	3945	t	t	t	\N	Paid
79422	41	2026-03-09	2026-03-19	1174.50	1274	t	t	t	\N	Paid
13043	87	2026-11-29	2026-12-13	1750.00	4032	f	f	f	\N	Canceled
90109	89	2027-01-04	2027-01-10	593.40	4925	f	f	f	\N	Canceled
94805	9	2026-04-01	2026-04-15	1593.90	3859	t	t	t	\N	Paid
30047	14	2027-01-30	2027-02-12	1509.30	4082	f	f	f	\N	Canceled
26612	21	2026-09-29	2026-10-03	523.80	3086	f	f	f	\N	Reserved
9329	0	2026-11-10	2026-11-16	793.80	3160	f	f	f	\N	Reserved
70396	56	2026-01-03	2026-01-05	202.40	1856	t	t	t	\N	Paid
66777	83	2026-01-15	2026-01-28	1755.00	3680	t	t	t	\N	Paid
4632	54	2026-01-29	2026-02-11	988.00	2957	t	t	t	\N	Paid
92393	50	2026-07-12	2026-07-14	267.30	2737	f	f	f	\N	Reserved
50422	14	2026-09-22	2026-09-24	232.20	1325	f	f	f	\N	Reserved
90550	23	2026-04-16	2026-04-18	212.50	2500	t	t	t	\N	Paid
86372	51	2026-10-23	2026-10-30	567.00	3911	f	f	f	\N	Canceled
74320	93	2026-10-06	2026-10-08	166.00	4324	f	f	f	\N	Reserved
78303	34	2027-01-08	2027-01-19	1366.20	4255	f	f	f	\N	Reserved
35799	77	2026-06-28	2026-07-10	1380.00	2235	f	f	f	\N	Reserved
66591	68	2026-10-09	2026-10-17	837.20	3915	f	f	f	\N	Reserved
29558	45	2026-01-13	2026-01-27	1610.00	4477	t	t	t	\N	Paid
18571	46	2026-01-19	2026-01-31	900.00	3058	t	t	t	\N	Paid
13769	90	2026-02-13	2026-02-19	579.60	3540	t	t	t	\N	Paid
94588	81	2026-12-03	2026-12-08	405.00	2881	f	f	f	\N	Reserved
23799	12	2026-05-14	2026-05-26	1409.40	4477	f	f	f	\N	Reserved
78753	41	2026-02-07	2026-02-21	1644.30	1053	t	t	t	\N	Paid
21861	15	2026-09-17	2026-09-28	1138.50	1615	f	f	f	\N	Reserved
60139	7	2026-01-30	2026-02-07	901.60	3281	t	t	t	\N	Paid
\.


--
-- Data for Name: frontworker; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.frontworker (staffid, username, password) FROM stdin;
21	hlewis	$2b$12$CTP9gyv1plBArp5B1Id9Z8
22	twhite	$2b$12$50kEnydx9qWCA79ISjs8JH
23	zhall	$2b$12$UdKF0j7elKPoh3pKMzKG5m
24	oyoung	$2b$12$SoyPstUeC99enq522wjZRL
25	staylor	$2b$12$9OaYsP6ihgIqLSmNqE40fA
26	dhernandez	$2b$12$raVNqTIAae24HZKjht3X13
27	ywilliams	$2b$12$npgW2zMj518Y2bTu5X1YqW
28	mlee	$2b$12$g21nYCsXoblu17rNy8H6h8
29	awhales	password123
\.


--
-- Data for Name: guest; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.guest (guestid, guestname, phonenumber, age, loyaltymember) FROM stdin;
2545	Ronald Jackson	7320491006	30	t
3365	Debra Ross	9250007016	47	t
2737	Melissa Jackson	3252173110	50	f
1615	Gary Long	4532964929	74	f
2195	Mei Nguyen	4278948117	52	f
2570	Donna Morales	9608140615	66	f
4054	Scott Cooper	7526732366	29	t
1400	Ravi Allen	2006018629	25	t
1201	Helen Torres	5731859397	49	t
1332	Yuki Turner	5827193381	34	f
4850	Carolyn Evans	8499034105	41	t
1119	Ashley Phillips	3824226288	60	f
3540	Gregory Moore	3977901717	38	f
3945	William Stewart	6187137026	63	t
4418	Omar Jones	9950846134	63	f
3108	Debra Evans	3762826167	32	f
4826	Michael King	9239241491	19	f
2255	Anthony Rogers	4851141877	77	f
4296	Paul Flores	2649777786	42	t
4988	Ashley Lee	3581325114	63	f
1509	Margaret Adams	4679585466	33	f
3142	Christopher Cook	3440822269	53	t
2458	Michael Carter	4473272913	18	f
3460	Liam Gomez	2580826174	58	f
3329	Betty Chen	4204785930	71	f
3050	David Gonzalez	5820485521	32	f
1473	Linda Flores	4893122743	70	t
2957	Jason Roberts	2553440352	73	t
3361	Jessica Morgan	4146997763	41	t
3404	Ivan Robinson	5105725897	18	f
4115	George Cox	5082599101	46	t
3758	Carol Brooks	9740943559	25	t
4477	Stephanie Turner	9425357613	47	t
2958	Raymond Collins	8609038413	55	t
1243	Larry Cox	2024599098	42	f
2777	Kimberly Wright	4894101559	45	f
3972	Samuel Nakamura	2751733759	75	f
1317	Ingrid Lewis	4726670568	73	f
4324	Laura Cruz	6466932974	56	f
1022	Christopher Turner	6714271261	55	f
2117	Carolyn Rodriguez	2323767034	39	f
2628	Stephanie Harris	5989352317	72	f
4784	Ivan Cook	2319071643	74	f
4538	Nadia Wood	4409498340	54	f
3017	Zoe Nguyen	4658374609	57	t
2627	Steven Price	5651892069	58	f
3842	Nicole Cook	3938695678	29	f
3110	Amanda Lopez	8905271719	38	f
1454	Deborah Lee	2951230443	64	t
4753	Nancy Gray	8248204051	63	t
3658	Karen Hill	5173725615	70	f
4108	Kevin Singh	7703640832	58	f
3859	Thomas Walker	8152917331	50	f
3900	Richard Martin	7700533650	40	f
2420	John Allen	2013403810	50	t
3390	Brenda Thompson	3187867101	57	f
4989	Carol Osei	5522190366	29	t
3413	Andrew James	3873896886	75	t
1238	Angela Walker	7081010022	42	t
2762	Lisa Baker	9705509363	48	f
4701	Jeffrey Diaz	2957962692	61	f
2768	Elena Sanchez	5968846191	30	t
2375	Mei Green	5130821076	69	f
3871	Nicole Baker	6242217916	48	f
2395	Helen Rogers	7627415967	53	t
1053	Patricia Allen	7680403601	38	t
4446	Ingrid Flores	5237115276	70	f
4604	Matthew Ivanova	5990657133	40	f
4763	Patricia Baker	7783261465	61	t
2710	Ingrid Cruz	9813098289	53	f
4456	Debra James	8330676248	18	t
4453	Joseph Wood	5845615747	54	t
4752	Sandra Lee	6922474391	64	t
3225	Ashley Ward	3236041536	22	f
4475	Susan Mitchell	8405323511	77	f
2507	Shirley Stewart	6130535481	19	f
3309	Timothy Howard	7731162029	66	t
2235	Joshua White	8116882317	39	f
3018	Dorothy Hill	5759136506	40	f
4597	Jacob Stewart	7422234445	79	f
3484	Andrew Morgan	7914260344	79	f
1618	Brian Ivanova	9187269188	24	f
2988	Emma Evans	2010353265	18	t
2125	Linda Hughes	7992657965	56	t
3876	Donna Campbell	3622539102	30	f
4473	Kimberly Diaz	8958935102	75	t
4082	Emma Wood	8828034656	66	f
3877	Richard Roberts	5898302548	44	f
4874	Richard Morgan	6458108442	47	f
4979	Tariq Miller	5356313689	51	t
1980	Shirley Lee	4726235390	63	t
2827	Elena Morgan	9791590063	68	t
3947	Michael Williams	8024636409	41	t
3086	Ivan Sanchez	2223626933	30	f
2037	Samuel Ross	9941777432	38	f
1608	Pamela Allen	4293774715	43	t
1110	Kwame Martinez	4819173506	52	t
2274	Shirley Flores	6454074565	44	f
3040	Lisa Ward	3488386789	57	t
3806	Barbara Ramirez	9298548544	67	t
4647	Rachel Brown	2549694853	53	t
3792	Wei Ward	2812713249	55	t
2836	Mark Evans	9677306843	18	f
3295	Susan Jackson	5271762973	62	f
3418	Robert Robinson	8372009180	74	f
4065	Karen Edwards	2082750712	56	f
3034	Robert Ivanova	2915605097	47	f
1602	Dorothy Gray	9679715792	75	t
1553	Jeffrey Myers	3856878761	33	f
3362	Linda Lopez	6023696942	32	f
3215	Ravi Jones	3778815308	47	f
4132	Omar Howard	8251645334	42	t
4871	Mary Reyes	3065900449	69	f
1761	Rachel Hill	3944223494	75	t
2881	Sharon Rogers	7127125849	40	t
4352	William James	6228526656	48	t
4343	Stephen Bell	2264479123	39	t
2020	Brian Wilson	3715005224	40	f
1578	Nancy Powell	6691168771	62	f
1790	Edward Collins	4369473653	58	t
1080	Yuki Johnson	4577377845	27	t
1663	Raymond Smith	3263194476	72	f
4255	Tariq Lewis	6793796640	51	f
4907	Emma Campbell	9530216434	77	f
2537	David Peterson	6634941085	24	t
4032	Sharon Chen	2154015257	26	f
1274	Tariq Edwards	2538399794	75	f
4877	Katherine Osei	6446597881	64	t
1341	Raymond Young	3891103635	38	t
4718	Amanda King	9755481588	56	t
3058	Liam Sanders	8741948137	59	t
2747	Susan Hill	7930827867	55	f
3680	Brian Anderson	2518671442	24	t
3676	Gary Cooper	8288408353	49	f
3639	Debra Gomez	8614807068	62	f
2692	John Nguyen	7706687536	48	t
1217	Christopher Miller	8824332042	74	f
3848	Mark Singh	8367811649	23	t
1771	Mary Cruz	9601255383	69	f
2202	Nicole Wright	8844164163	71	t
4271	Lisa Torres	3459750232	48	t
4471	Nancy Brooks	4574768927	72	f
1793	Katherine Diaz	6082717489	62	t
2500	Tariq Morris	2172567974	62	t
4799	Barbara Patel	8886987447	67	t
3160	Gregory Richardson	7416739515	32	t
2861	Ivan Sanchez	2114397961	54	f
1836	Christine Carter	4872453418	54	f
1360	Steven Baker	5398726431	26	f
1325	Ingrid Young	5487712197	18	t
2157	Angela Hill	9540627434	57	f
3445	Katherine Thompson	8653873582	72	t
4304	William Long	9922570202	48	f
1650	Benjamin Johnson	4703768147	33	t
2942	Laura Myers	2487842091	47	t
2110	Ronald Edwards	3134535972	62	t
2760	Emma Morgan	6276861366	59	f
3180	Anthony Sanchez	7731317898	47	f
1187	Mei Collins	2786420960	39	f
2358	Samuel Murphy	3073577418	25	t
1565	Ronald Gomez	8505430203	74	f
3042	Stephen Watson	4028782021	66	t
1996	Donald Phillips	7754111188	44	t
3808	Dorothy Stewart	2471908055	44	f
3915	Daniel Anderson	4985833594	78	t
1719	Deborah Nelson	3843057977	52	t
2387	Joshua Evans	9589791535	46	t
2822	Benjamin Chen	8838380611	39	t
3281	John Adams	9143263654	31	f
1856	Zoe Patel	3964725897	36	t
2802	Lisa Reyes	6122367051	38	t
1682	Susan Lewis	6462940966	77	t
3847	Sofia Diaz	2064008171	67	t
4925	Priya Gonzalez	6516813790	46	f
1405	Deborah Rivera	4528288856	74	f
1180	Melissa Gomez	8610370571	69	t
3733	Ingrid Cooper	7282402580	75	f
2990	Wei Campbell	3920629234	73	t
3176	Jonathan Okafor	3374689975	64	t
3911	Helen Sanchez	7365601807	30	t
4413	Larry Lewis	8332016937	67	f
4548	Samantha Phillips	8790649578	79	f
1211	Kimberly Smith	8974726352	80	t
2799	Joshua Sanders	8869933370	37	f
1478	Nadia Taylor	3500876401	71	f
1380	Nicole Cox	5912261986	18	t
3401	Andrew Edwards	8621805945	20	t
2575	Lisa Martinez	5987053237	41	t
4739	Rebecca Morris	7357597575	64	t
1518	Donald James	7951678300	23	t
1537	Jessica Gray	9852582361	46	t
1145	Carol Hassan	8588663067	26	f
4857	Amanda Chen	4999715708	29	f
4711	Laura Nelson	7997544142	33	t
3183	William Rivera	7708296777	45	f
2763	Jeffrey Nguyen	8541282768	28	t
3120	Ryan Scott	3737459434	20	f
3719	Kathleen Cook	9038015865	49	t
2602	Steven Taylor	4593448912	19	t
4338	Jeffrey Flores	3355108616	32	f
\.


--
-- Data for Name: housekeeper; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.housekeeper (staffid, monavail, tuesavail, wedavail, thursdavail, friavail, satavail, sunavail) FROM stdin;
1	f	f	t	t	t	t	f
2	t	t	t	f	f	f	f
3	t	f	f	t	f	t	t
4	t	t	f	f	f	t	f
5	t	t	t	f	f	f	t
6	t	f	t	f	f	f	t
7	f	t	t	f	f	f	f
8	t	t	f	t	t	t	t
9	t	f	t	f	f	f	f
10	t	t	f	f	t	f	f
11	t	f	t	f	t	t	f
12	t	t	f	t	t	f	f
13	t	t	f	f	t	t	t
14	t	t	f	t	t	t	f
15	t	f	f	t	t	f	f
16	f	f	f	t	t	t	t
17	f	t	t	t	t	t	t
18	t	t	t	f	t	t	f
19	f	t	t	f	t	f	f
20	t	t	t	f	f	f	f
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.location (buildingid, amenities, address, phonenumber, locationname) FROM stdin;
501	This location includes a rooftop pool, complimentarry breakfast, and a small gym.	8387 W Blueberry Blvd, Chandler AZ	999-999-9999	Happy Hotel
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.room (roomid, price, bedcount, roomtype, roomnumber, petfriendly, accessible, smokefree, buildingid) FROM stdin;
0	132.30	2	Suite	100	t	t	f	501
1	118.80	2	Suite	101	f	t	f	501
2	108.75	2	Junier Suite	102	t	f	t	501
3	92.00	1	Standard	103	t	f	f	501
4	106.95	1	Delux	104	t	f	t	501
5	125.00	2	Junier Suite	105	t	f	t	501
6	105.00	2	Junier Suite	106	f	t	t	501
7	112.70	1	Delux	107	f	t	t	501
8	98.90	1	Delux	108	t	t	f	501
9	113.85	1	Delux	109	f	f	f	501
10	122.50	2	Junier Suite	110	f	f	f	501
11	95.45	1	Delux	111	f	f	f	501
12	117.45	2	Suite	112	t	t	t	501
13	105.80	1	Delux	113	f	t	t	501
14	116.10	2	Suite	114	t	t	t	501
15	103.50	1	Delux	115	f	t	t	501
16	97.50	1	Junier Suite	116	t	f	f	501
17	108.00	1	Suite	117	t	f	f	501
18	122.85	2	Suite	118	t	f	f	501
19	108.00	1	Suite	119	f	t	t	501
20	106.25	1	Junier Suite	120	f	f	t	501
21	130.95	1	Suite	121	f	t	f	501
22	95.45	2	Delux	122	f	t	f	501
23	106.25	2	Junier Suite	123	t	t	t	501
24	103.75	2	Junier Suite	124	f	t	f	501
25	97.50	2	Junier Suite	125	f	t	t	501
26	112.50	1	Junier Suite	126	t	f	t	501
27	110.40	2	Delux	127	f	t	f	501
28	110.40	2	Delux	128	f	f	t	501
29	90.00	2	Standard	129	t	t	f	501
30	88.00	2	Standard	130	f	t	t	501
31	75.00	2	Standard	131	f	t	f	501
32	110.00	1	Junier Suite	132	f	t	t	501
33	109.25	1	Delux	133	t	t	f	501
34	124.20	1	Suite	134	t	t	t	501
35	94.00	2	Standard	135	t	t	t	501
36	105.30	2	Suite	136	f	f	t	501
37	100.05	2	Delux	137	f	f	f	501
38	97.75	2	Delux	138	f	f	t	501
39	118.75	2	Junier Suite	139	f	t	f	501
40	118.80	2	Suite	140	t	t	t	501
41	117.45	1	Suite	141	t	f	t	501
42	117.45	2	Suite	142	t	f	t	501
43	117.50	1	Junier Suite	143	f	f	f	501
44	121.50	2	Suite	144	f	f	f	501
45	115.00	2	Junier Suite	145	t	t	f	501
46	75.00	2	Standard	146	f	f	t	501
47	96.25	1	Junier Suite	147	f	f	t	501
48	97.75	2	Delux	148	t	f	t	501
49	76.00	2	Standard	149	t	t	t	501
50	133.65	1	Suite	150	f	f	t	501
51	81.00	1	Standard	151	t	t	f	501
52	124.20	1	Suite	152	t	t	f	501
53	118.80	2	Suite	153	f	f	f	501
54	76.00	1	Standard	154	t	t	f	501
55	83.00	1	Standard	155	t	f	f	501
56	101.20	1	Delux	156	f	t	t	501
57	121.50	1	Suite	157	t	t	t	501
58	115.00	2	Delux	158	t	f	f	501
59	117.45	1	Suite	159	f	f	f	501
60	111.55	2	Delux	160	t	t	f	501
61	102.50	2	Junier Suite	161	f	t	f	501
62	115.00	1	Delux	162	f	t	f	501
63	103.75	2	Junier Suite	163	f	t	t	501
64	101.25	2	Junier Suite	164	f	f	f	501
65	135.00	2	Suite	165	f	f	t	501
66	78.00	2	Standard	166	f	f	f	501
67	102.35	2	Delux	167	t	t	t	501
68	104.65	1	Delux	168	t	f	f	501
69	89.00	1	Standard	169	t	f	f	501
70	123.75	1	Junier Suite	170	t	t	f	501
71	105.00	1	Junier Suite	171	f	t	t	501
72	83.00	1	Standard	172	f	t	t	501
73	99.00	1	Standard	173	t	f	t	501
74	103.95	2	Suite	174	t	t	t	501
75	124.20	2	Suite	175	f	f	f	501
76	116.10	1	Suite	176	f	t	t	501
77	115.00	1	Junier Suite	177	t	f	f	501
78	125.55	2	Suite	178	t	f	t	501
79	112.70	1	Delux	179	t	f	t	501
80	129.60	1	Suite	180	t	f	f	501
81	81.00	1	Standard	181	f	f	t	501
82	98.75	1	Junier Suite	182	t	f	f	501
83	135.00	2	Suite	183	f	t	f	501
84	101.25	1	Junier Suite	184	f	t	f	501
85	80.00	1	Standard	185	t	f	t	501
86	88.00	1	Standard	186	f	t	t	501
87	125.00	1	Junier Suite	187	f	f	f	501
88	94.00	1	Standard	188	t	t	f	501
89	98.90	2	Delux	189	f	f	f	501
90	96.60	2	Delux	190	t	f	f	501
91	132.30	1	Suite	191	f	t	t	501
92	118.75	2	Junier Suite	192	f	f	t	501
93	83.00	2	Standard	193	f	t	f	501
94	103.95	1	Suite	194	f	t	t	501
95	115.00	2	Junier Suite	195	f	f	f	501
96	110.40	2	Delux	196	f	t	t	501
97	107.50	2	Junier Suite	197	t	f	f	501
98	113.40	2	Suite	198	f	t	t	501
99	80.00	2	Standard	199	t	t	f	501
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: rosiegeisler
--

COPY public.staff (staffid, name, phonenumber, buildingid) FROM stdin;
1	Anna Patel	480-754-2824	501
2	Ethan Rivera	480-125-5506	501
3	Maria Johnson	480-350-4657	501
4	James Anderson	480-242-2679	501
5	Emma Lopez	480-792-9935	501
6	Liam Kim	480-189-7912	501
7	Aisha Brown	480-132-1488	501
8	Mei Chen	480-195-4582	501
9	Ines Thomas	480-338-9279	501
10	Luis Smith	480-716-1434	501
11	Fatima Garcia	480-674-4257	501
12	Ahmed Jackson	480-833-9928	501
13	Sofia Martinez	480-529-4611	501
14	Carlos Nguyen	480-559-5557	501
15	Priya Singh	480-928-1106	501
16	Noah Davis	480-877-3615	501
17	Raj Wilson	480-814-7924	501
18	Wei Harris	480-448-5552	501
19	Elena Moore	480-259-4527	501
20	Kenji Clark	480-881-6514	501
21	Hana Lewis	480-204-2519	501
22	Tyler White	480-489-2584	501
23	Zara Hall	480-467-6635	501
24	Omar Young	480-718-5333	501
25	Sarah Taylor	480-926-1711	501
26	David Hernandez	480-847-8527	501
27	Yuki Williams	480-649-3045	501
28	Marcus Lee	480-487-2291	501
29	Alice Whales	480-555-1234	501
\.


--
-- Name: booking_bookingid_seq; Type: SEQUENCE SET; Schema: public; Owner: rosiegeisler
--

SELECT pg_catalog.setval('public.booking_bookingid_seq', 1, false);


--
-- Name: guest_guestid_seq; Type: SEQUENCE SET; Schema: public; Owner: rosiegeisler
--

SELECT pg_catalog.setval('public.guest_guestid_seq', 1, false);


--
-- Name: location_buildingid_seq; Type: SEQUENCE SET; Schema: public; Owner: rosiegeisler
--

SELECT pg_catalog.setval('public.location_buildingid_seq', 1, false);


--
-- Name: room_roomid_seq; Type: SEQUENCE SET; Schema: public; Owner: rosiegeisler
--

SELECT pg_catalog.setval('public.room_roomid_seq', 1, false);


--
-- Name: staff_staffid_seq; Type: SEQUENCE SET; Schema: public; Owner: rosiegeisler
--

SELECT pg_catalog.setval('public.staff_staffid_seq', 1, false);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (bookingid);


--
-- Name: frontworker frontworker_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.frontworker
    ADD CONSTRAINT frontworker_pkey PRIMARY KEY (staffid);


--
-- Name: frontworker frontworker_username_key; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.frontworker
    ADD CONSTRAINT frontworker_username_key UNIQUE (username);


--
-- Name: guest guest_phonenumber_key; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.guest
    ADD CONSTRAINT guest_phonenumber_key UNIQUE (phonenumber);


--
-- Name: guest guest_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.guest
    ADD CONSTRAINT guest_pkey PRIMARY KEY (guestid);


--
-- Name: housekeeper housekeeper_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.housekeeper
    ADD CONSTRAINT housekeeper_pkey PRIMARY KEY (staffid);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (buildingid);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (roomid);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (staffid);


--
-- Name: booking booking_guestid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_guestid_fkey FOREIGN KEY (guestid) REFERENCES public.guest(guestid);


--
-- Name: booking booking_housekeeper_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_housekeeper_fkey FOREIGN KEY (housekeeper) REFERENCES public.housekeeper(staffid);


--
-- Name: booking booking_roomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_roomid_fkey FOREIGN KEY (roomid) REFERENCES public.room(roomid);


--
-- Name: frontworker frontworker_staffid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.frontworker
    ADD CONSTRAINT frontworker_staffid_fkey FOREIGN KEY (staffid) REFERENCES public.staff(staffid) ON DELETE CASCADE;


--
-- Name: housekeeper housekeeper_staffid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.housekeeper
    ADD CONSTRAINT housekeeper_staffid_fkey FOREIGN KEY (staffid) REFERENCES public.staff(staffid) ON DELETE CASCADE;


--
-- Name: room room_buildingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_buildingid_fkey FOREIGN KEY (buildingid) REFERENCES public.location(buildingid);


--
-- Name: staff staff_buildingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rosiegeisler
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_buildingid_fkey FOREIGN KEY (buildingid) REFERENCES public.location(buildingid);


--
-- PostgreSQL database dump complete
--

\unrestrict rGcGgBKJcMEhtVQHK8E1B4fQP0DttIVKuqnsCswQ7T39E2rwAOZX8VvQC8JzKYX

