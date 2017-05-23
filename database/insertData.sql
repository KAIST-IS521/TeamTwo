use shoppingmalldb;

INSERT INTO github_users ( github_id, email ) VALUES('alinghi', 'alinghi@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('asdfljh', 'cjdhlds08@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('bjgwak', 'bjgwak@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('blukat29', 'yunjong@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('DaramG', 'gksgudtjr456@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('dinggul', 'dinggul@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('donghwan17', 'prious@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('ggoboogy', 'jihyeon.yoon@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('Hyeongcheol-An', 'anh1026@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('ian0371', 'ian0371@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('jaemoon-sim', 'jettijam@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('james010kim', 'jangha@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('jcassou', 'jean.cassou-mounat@insa-lyon.fr');
INSERT INTO github_users ( github_id, email ) VALUES('jchoi2022', 'jschoi.2022@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('JeongOhKye', 'ohkye415@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('jhong3842', 'jhong3842@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('jmpark81', 'jmpark81@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('juanaevv', 'juanaevv@nate.com');
INSERT INTO github_users ( github_id, email ) VALUES('kaistgun', 'signal@kait.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('lbh0307', 'lbh0307@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('mfaerevaag', 'markus@faerevaag.no');
INSERT INTO github_users ( github_id, email ) VALUES('mickan921', 'jsoh921@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('mikkang', 'kmb1109@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('nohkwak', 'nhkwak@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('pr0v3rbs', 'pr0v3rbs@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('sbahn1992', 'sbahn1992@gmail.com');
INSERT INTO github_users ( github_id, email ) VALUES('seongil', 'su3604@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('seungwonwoo', 'seungwonwoo@kaist.ac.kr');
INSERT INTO github_users ( github_id, email ) VALUES('soomin-kim', 'soomink@kaist.ac.kr');

INSERT INTO users VALUES( 'test',  'test', 'nohkwak');

INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '5', 'ANCIENT CIVILIZATION', '/pics/ancient.png', 'ABCD-33DF-SFAF-F3AF');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '10', 'DIABLO MOUNTAIN', '/pics/diablo.png', 'KDGK-J2DF-AFIO-SSKG');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '1000000000', 'FLAG', '/pics/flag.png', '****-****-****-****');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '20', 'HORDE', '/pics/horde.png', 'BKEI-NS92-6DEH-DKFW');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '20', 'HYPER MARIO Bros', '/pics/hyper.png', 'NSDK-FLJS-IWSJ-FSKL');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '30', 'PLANET CRAFT', '/pics/planet.png', 'INGI-WOGN-DGKS-NJKG');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '30', 'THE RESTORANTS', '/pics/restorants.png', 'NZIR-NSKG-ISNG-IWPQ');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '50', 'SOCCER MANAGER 2022', '/pics/soccer.png', 'OWEU-NGKZ-GNBG-7LWN');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '50', 'HEROES OF SERGEONS', '/pics/stone.png', 'QNAM-ZIGN-IOPS-NXLO');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '10', 'KOREAN TRUCK SIMULATOR', '/pics/truck.png', 'Q9I4-H2MX-CFV9-82BA');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '10', 'PLANET CRAFT 2', '/pics/planet2.png', 'KGIG-NREI-382U-NBGW');
INSERT INTO products ( price, name, imgsrc, serial_key ) VALUES ( '5', 'REAL WATCH', '/pics/watch.png', 'KDNG-I023-874N-DS82');

INSERT INTO shopping_cart ( user_id, product_id, product_num ) VALUES( 'test', '1', '3' );
