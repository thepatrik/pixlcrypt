--Insert user
insert into
pixlcrypt.user(name, username, email)
values(
    'Patrik Palmér',
    'thepatrik',
    'patrik@pixlcrypt.com'
);

--Insert item
insert into
pixlcrypt.item(src, caption, description, mime, content_type, user_id)
values(
    'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
    'After Rain (Jeshu John - designerspics.com)',
    'Totally awesome stuff',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg',
    320,
    174,
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg')
);

insert into
pixlcrypt.tag(key, val, user_id)
values(
    'Nature',
    'Nature',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.tag(key, val, user_id)
values(
    'Flora',
    'Flora',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg'),
    (select id from pixlcrypt.tag where key='Nature' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg'),
    (select id from pixlcrypt.tag where key='Flora' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
    'Boats (Jeshu John - designerspics.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg',
    320,
    212,
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg',
    'Color Pencils (Jeshu John - designerspics.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg',
    320,
    212,
    (select id from pixlcrypt.item where src='https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c7.staticflickr.com/9/8546/28354329294_bb45ba31fa_b.jpg',
    'Red Apples with other Red Fruit (foodiesfeed.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c7.staticflickr.com/9/8546/28354329294_bb45ba31fa_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8546/28354329294_bb45ba31fa_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c6.staticflickr.com/9/8890/28897154101_a8f55be225_b.jpg',
    '37H (gratispgraphy.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c6.staticflickr.com/9/8890/28897154101_a8f55be225_n.jpg',
    320,
    183,
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8890/28897154101_a8f55be225_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg',
    '8H (gratisography.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_n.jpg',
    240,
    320,
    (select id from pixlcrypt.item where src='https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg'),
    (select id from pixlcrypt.tag where key='Nature' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg',
    '286H (gratisography.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_n.jpg',
    320,
    190,
    (select id from pixlcrypt.item where src='https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg',
    '315H (gratisography.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c7.staticflickr.com/9/8569/28941134686_d57273d933_n.jpg',
    320,
    148,
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg')
);

insert into
pixlcrypt.tag(key, val, user_id)
values(
    'People',
    'People',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg'),
    (select id from pixlcrypt.tag where key='People' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg',
    '201H (gratisography.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c6.staticflickr.com/9/8342/28897193381_800db6419e_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, description, caption, mime, content_type, user_id)
values(
    'https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg',
    'Big Ben - London',
    'Big Ben (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_n.jpg',
    248,
    320,
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, description, caption, mime, content_type, user_id)
values(
    'https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_b.jpg',
    'Red Zone - Paris',
    'Red Zone - Paris (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_n.jpg',
    320,
    113,
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_b.jpg')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8785/28687743710_3580fcb5f0_b.jpg'),
    (select id from pixlcrypt.tag where key='People' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, description, caption, mime, content_type, user_id)
values(
    'https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_b.jpg',
    'Wood Glass',
    'Wood Glass (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_n.jpg',
    313,
    320,
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8520/28357073053_cafcb3da6f_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_b.jpg',
    'Flower Interior Macro (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c4.staticflickr.com/9/8562/28897228731_ff4447ef5f_b.jpg',
    'Old Barn (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c4.staticflickr.com/9/8562/28897228731_ff4447ef5f_n.jpg',
    320,
    194,
    (select id from pixlcrypt.item where src='https://c4.staticflickr.com/9/8562/28897228731_ff4447ef5f_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, description, caption, mime, content_type, user_id)
values(
    'https://c2.staticflickr.com/8/7577/28973580825_d8f541ba3f_b.jpg',
    'Cosmos Flower',
    'Cosmos Flower Macro (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c2.staticflickr.com/8/7577/28973580825_d8f541ba3f_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c2.staticflickr.com/8/7577/28973580825_d8f541ba3f_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg',
    'Orange Macro (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c7.staticflickr.com/9/8106/28941228886_86d1450016_n.jpg',
    271,
    320,
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c1.staticflickr.com/9/8330/28941240416_71d2a7af8e_b.jpg',
    'Surfer Sunset (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c1.staticflickr.com/9/8330/28941240416_71d2a7af8e_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8330/28941240416_71d2a7af8e_b.jpg')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8330/28941240416_71d2a7af8e_b.jpg'),
    (select id from pixlcrypt.tag where key='Nature' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8330/28941240416_71d2a7af8e_b.jpg'),
    (select id from pixlcrypt.tag where key='People' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_b.jpg',
    'Man on BMX (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_b.jpg')
);

insert into
pixlcrypt.tag(key, val, user_id)
values(
    'Sport',
    'Sport',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_b.jpg'),
    (select id from pixlcrypt.tag where key='Sport' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_b.jpg'),
    (select id from pixlcrypt.tag where key='People' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c4.staticflickr.com/9/8578/28357117603_97a8233cf5_b.jpg',
    'Ropeman - Thailand (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c4.staticflickr.com/9/8578/28357117603_97a8233cf5_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c4.staticflickr.com/9/8578/28357117603_97a8233cf5_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c4.staticflickr.com/8/7476/28973628875_069e938525_b.jpg',
    'Time to Think (Tom Eversley - isorepublic.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c4.staticflickr.com/8/7476/28973628875_069e938525_n.jpg',
    320,
    213,
    (select id from pixlcrypt.item where src='https://c4.staticflickr.com/8/7476/28973628875_069e938525_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c6.staticflickr.com/9/8593/28357129133_f04c73bf1e_b.jpg',
    'Untitled (Jan Vasek - jeshoots.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c6.staticflickr.com/9/8593/28357129133_f04c73bf1e_n.jpg',
    320,
    179,
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8593/28357129133_f04c73bf1e_b.jpg')
);

insert into
pixlcrypt.tag(key, val, user_id)
values(
    'Fauna',
    'Fauna',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8593/28357129133_f04c73bf1e_b.jpg'),
    (select id from pixlcrypt.tag where key='Fauna' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8593/28357129133_f04c73bf1e_b.jpg'),
    (select id from pixlcrypt.tag where key='Nature' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c6.staticflickr.com/9/8893/28897116141_641b88e342_b.jpg',
    'UUntitled (moveast.me)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c6.staticflickr.com/9/8893/28897116141_641b88e342_n.jpg',
    320,
    215,
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8893/28897116141_641b88e342_b.jpg')
);

insert into
pixlcrypt.item_tag(item_id, tag_id)
values(
    (select id from pixlcrypt.item where src='https://c6.staticflickr.com/9/8893/28897116141_641b88e342_b.jpg'),
    (select id from pixlcrypt.tag where key='People' and user_id=(select id from pixlcrypt.user where email='patrik@pixlcrypt.com'))
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c1.staticflickr.com/9/8056/28354485944_148d6a5fc1_b.jpg',
    'A photo by 贝莉儿 NG. (unsplash.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c1.staticflickr.com/9/8056/28354485944_148d6a5fc1_n.jpg',
    257,
    320,
    (select id from pixlcrypt.item where src='https://c1.staticflickr.com/9/8056/28354485944_148d6a5fc1_b.jpg')
);

--Insert item
insert into
pixlcrypt.item(src, caption, mime, content_type, user_id)
values(
    'https://c7.staticflickr.com/9/8824/28868764222_19f3b30773_b.jpg',
    'AA photo by Matthew Wiebe. (unsplash.com)',
    'image/jpeg',
    'photo',
    (select id from pixlcrypt.user where email='patrik@pixlcrypt.com')
);

insert into
pixlcrypt.thumb(src, width, height, item_id)
values(
    'https://c7.staticflickr.com/9/8824/28868764222_19f3b30773_n.jpg',
    226,
    320,
    (select id from pixlcrypt.item where src='https://c7.staticflickr.com/9/8824/28868764222_19f3b30773_b.jpg')
);
