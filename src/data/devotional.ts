// Daily devotional engine shared by the website, the command center and the
// faith-forward-daily-quotes repository (exported to public/content/devotional.json).
//
// Scripture is King James Version (public domain). Prayers are original to
// Faith Forward. The three pools rotate independently, so the daily combination
// does not repeat for years, and feast/holiday overrides take priority.

export interface Verse { text: string; ref: string; theme: string }
export interface Quote { text: string; author: string }
export interface Prayer { title: string; text: string }
export interface Devotional { date: string; verse: Verse; quote: Quote; prayer: Prayer; feast?: string }

export const VERSES: Verse[] = [
  { text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', ref: 'Joshua 1:9', theme: 'courage' },
  { text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', ref: 'Proverbs 3:5-6', theme: 'trust' },
  { text: 'I can do all things through Christ which strengtheneth me.', ref: 'Philippians 4:13', theme: 'strength' },
  { text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', ref: 'Romans 8:28', theme: 'purpose' },
  { text: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1', theme: 'provision' },
  { text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', ref: 'Jeremiah 29:11', theme: 'hope' },
  { text: 'Casting all your care upon him; for he careth for you.', ref: '1 Peter 5:7', theme: 'peace' },
  { text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', ref: 'Isaiah 40:31', theme: 'endurance' },
  { text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.', ref: 'Psalm 34:18', theme: 'healing' },
  { text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.', ref: '2 Corinthians 5:17', theme: 'renewal' },
  { text: 'He healeth the broken in heart, and bindeth up their wounds.', ref: 'Psalm 147:3', theme: 'healing' },
  { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28', theme: 'rest' },
  { text: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.', ref: 'Proverbs 18:10', theme: 'refuge' },
  { text: 'Greater love hath no man than this, that a man lay down his life for his friends.', ref: 'John 15:13', theme: 'sacrifice' },
  { text: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.', ref: 'Ephesians 6:11', theme: 'spiritual warfare' },
  { text: 'God is our refuge and strength, a very present help in trouble.', ref: 'Psalm 46:1', theme: 'refuge' },
  { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10', theme: 'stillness' },
  { text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', ref: 'Isaiah 41:10', theme: 'courage' },
  { text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', ref: 'John 14:27', theme: 'peace' },
  { text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.', ref: 'Psalm 91:1', theme: 'protection' },
  { text: 'For he shall give his angels charge over thee, to keep thee in all thy ways.', ref: 'Psalm 91:11', theme: 'protection' },
  { text: 'Blessed be the LORD my strength, which teacheth my hands to war, and my fingers to fight.', ref: 'Psalm 144:1', theme: 'warrior' },
  { text: 'I have fought a good fight, I have finished my course, I have kept the faith.', ref: '2 Timothy 4:7', theme: 'perseverance' },
  { text: 'Thou therefore endure hardness, as a good soldier of Jesus Christ.', ref: '2 Timothy 2:3', theme: 'endurance' },
  { text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', ref: '2 Timothy 1:7', theme: 'courage' },
  { text: 'Weeping may endure for a night, but joy cometh in the morning.', ref: 'Psalm 30:5', theme: 'hope' },
  { text: 'The LORD shall preserve thy going out and thy coming in from this time forth, and even for evermore.', ref: 'Psalm 121:8', theme: 'protection' },
  { text: 'I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.', ref: 'Psalm 121:1-2', theme: 'help' },
  { text: 'Bear ye one another\'s burdens, and so fulfil the law of Christ.', ref: 'Galatians 6:2', theme: 'brotherhood' },
  { text: 'And let us not be weary in well doing: for in due season we shall reap, if we faint not.', ref: 'Galatians 6:9', theme: 'perseverance' },
  { text: 'Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.', ref: 'Matthew 25:40', theme: 'service' },
  { text: 'For I was an hungred, and ye gave me meat: I was thirsty, and ye gave me drink: I was a stranger, and ye took me in.', ref: 'Matthew 25:35', theme: 'service' },
  { text: 'Is not this the fast that I have chosen? ... to deal thy bread to the hungry, and that thou bring the poor that are cast out to thy house?', ref: 'Isaiah 58:6-7', theme: 'service' },
  { text: 'A righteous man regardeth the life of his beast.', ref: 'Proverbs 12:10', theme: 'creation' },
  { text: 'But ask now the beasts, and they shall teach thee; and the fowls of the air, and they shall tell thee.', ref: 'Job 12:7', theme: 'creation' },
  { text: 'Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.', ref: 'Ecclesiastes 4:9-10', theme: 'brotherhood' },
  { text: 'A friend loveth at all times, and a brother is born for adversity.', ref: 'Proverbs 17:17', theme: 'brotherhood' },
  { text: 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.', ref: 'Proverbs 27:17', theme: 'brotherhood' },
  { text: 'Blessed are the peacemakers: for they shall be called the children of God.', ref: 'Matthew 5:9', theme: 'peace' },
  { text: 'Blessed are they that mourn: for they shall be comforted.', ref: 'Matthew 5:4', theme: 'grief' },
  { text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.', ref: 'Psalm 23:4', theme: 'courage' },
  { text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.', ref: 'Psalm 23:3', theme: 'renewal' },
  { text: 'My grace is sufficient for thee: for my strength is made perfect in weakness.', ref: '2 Corinthians 12:9', theme: 'grace' },
  { text: 'We are troubled on every side, yet not distressed; we are perplexed, but not in despair; persecuted, but not forsaken; cast down, but not destroyed.', ref: '2 Corinthians 4:8-9', theme: 'endurance' },
  { text: 'Wherefore lift up the hands which hang down, and the feeble knees; and make straight paths for your feet.', ref: 'Hebrews 12:12-13', theme: 'renewal' },
  { text: 'Let us hold fast the profession of our faith without wavering; (for he is faithful that promised).', ref: 'Hebrews 10:23', theme: 'faith' },
  { text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', ref: 'Hebrews 11:1', theme: 'faith' },
  { text: 'I will never leave thee, nor forsake thee.', ref: 'Hebrews 13:5', theme: 'presence' },
  { text: 'Be not forgetful to entertain strangers: for thereby some have entertained angels unawares.', ref: 'Hebrews 13:2', theme: 'hospitality' },
  { text: 'Jesus Christ the same yesterday, and to day, and for ever.', ref: 'Hebrews 13:8', theme: 'faithfulness' },
  { text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.', ref: 'Lamentations 3:22-23', theme: 'mercy' },
  { text: 'The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love.', ref: 'Zephaniah 3:17', theme: 'love' },
  { text: 'When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee.', ref: 'Isaiah 43:2', theme: 'presence' },
  { text: 'Remember ye not the former things, neither consider the things of old. Behold, I will do a new thing.', ref: 'Isaiah 43:18-19', theme: 'renewal' },
  { text: 'Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me.', ref: 'Isaiah 6:8', theme: 'calling' },
  { text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?', ref: 'Micah 6:8', theme: 'justice' },
  { text: 'The Spirit of the Lord is upon me, because he hath anointed me to preach the gospel to the poor; he hath sent me to heal the brokenhearted.', ref: 'Luke 4:18', theme: 'mission' },
  { text: 'For the Son of man is come to seek and to save that which was lost.', ref: 'Luke 19:10', theme: 'redemption' },
  { text: 'But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.', ref: 'Luke 15:20', theme: 'redemption' },
  { text: 'I am the good shepherd: the good shepherd giveth his life for the sheep.', ref: 'John 10:11', theme: 'shepherd' },
  { text: 'In the world ye shall have tribulation: but be of good cheer; I have overcome the world.', ref: 'John 16:33', theme: 'victory' },
  { text: 'I am the way, the truth, and the life.', ref: 'John 14:6', theme: 'faith' },
  { text: 'And ye shall know the truth, and the truth shall make you free.', ref: 'John 8:32', theme: 'freedom' },
  { text: 'There is therefore now no condemnation to them which are in Christ Jesus.', ref: 'Romans 8:1', theme: 'forgiveness' },
  { text: 'Nay, in all these things we are more than conquerors through him that loved us.', ref: 'Romans 8:37', theme: 'victory' },
  { text: 'Be not overcome of evil, but overcome evil with good.', ref: 'Romans 12:21', theme: 'victory' },
  { text: 'Rejoicing in hope; patient in tribulation; continuing instant in prayer.', ref: 'Romans 12:12', theme: 'prayer' },
  { text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', ref: 'Philippians 4:6', theme: 'prayer' },
  { text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', ref: 'Philippians 4:7', theme: 'peace' },
  { text: 'Forgetting those things which are behind, and reaching forth unto those things which are before, I press toward the mark.', ref: 'Philippians 3:13-14', theme: 'forward' },
  { text: 'Being confident of this very thing, that he which hath begun a good work in you will perform it.', ref: 'Philippians 1:6', theme: 'hope' },
  { text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.', ref: 'Ephesians 6:10', theme: 'strength' },
  { text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.', ref: 'Ephesians 4:32', theme: 'forgiveness' },
  { text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.', ref: 'Ephesians 2:8', theme: 'grace' },
  { text: 'Watch ye, stand fast in the faith, quit you like men, be strong.', ref: '1 Corinthians 16:13', theme: 'courage' },
  { text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.', ref: '1 Corinthians 13:4', theme: 'love' },
  { text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.', ref: '1 Corinthians 13:13', theme: 'love' },
  { text: 'There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able.', ref: '1 Corinthians 10:13', theme: 'recovery' },
  { text: 'Pray without ceasing. In every thing give thanks.', ref: '1 Thessalonians 5:17-18', theme: 'prayer' },
  { text: 'Wherefore comfort yourselves together, and edify one another.', ref: '1 Thessalonians 5:11', theme: 'brotherhood' },
  { text: 'Draw nigh to God, and he will draw nigh to you.', ref: 'James 4:8', theme: 'presence' },
  { text: 'Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction.', ref: 'James 1:27', theme: 'service' },
  { text: 'Even so faith, if it hath not works, is dead, being alone.', ref: 'James 2:17', theme: 'service' },
  { text: 'Be sober, be vigilant; because your adversary the devil, as a roaring lion, walketh about, seeking whom he may devour.', ref: '1 Peter 5:8', theme: 'vigilance' },
  { text: 'Beloved, let us love one another: for love is of God.', ref: '1 John 4:7', theme: 'love' },
  { text: 'There is no fear in love; but perfect love casteth out fear.', ref: '1 John 4:18', theme: 'love' },
  { text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.', ref: '1 John 1:9', theme: 'forgiveness' },
  { text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying.', ref: 'Revelation 21:4', theme: 'hope' },
  { text: 'Behold, I stand at the door, and knock.', ref: 'Revelation 3:20', theme: 'invitation' },
  { text: 'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee.', ref: 'Numbers 6:24-25', theme: 'blessing' },
  { text: 'The eternal God is thy refuge, and underneath are the everlasting arms.', ref: 'Deuteronomy 33:27', theme: 'refuge' },
  { text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.', ref: 'Deuteronomy 31:6', theme: 'courage' },
  { text: 'The battle is the LORD\'s.', ref: '1 Samuel 17:47', theme: 'warrior' },
  { text: 'But David encouraged himself in the LORD his God.', ref: '1 Samuel 30:6', theme: 'resilience' },
  { text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.', ref: 'Psalm 118:24', theme: 'joy' },
  { text: 'Thy word is a lamp unto my feet, and a light unto my path.', ref: 'Psalm 119:105', theme: 'guidance' },
  { text: 'Create in me a clean heart, O God; and renew a right spirit within me.', ref: 'Psalm 51:10', theme: 'renewal' },
  { text: 'I sought the LORD, and he heard me, and delivered me from all my fears.', ref: 'Psalm 34:4', theme: 'deliverance' },
  { text: 'The angel of the LORD encampeth round about them that fear him, and delivereth them.', ref: 'Psalm 34:7', theme: 'protection' },
  { text: 'Why art thou cast down, O my soul? and why art thou disquieted in me? hope thou in God.', ref: 'Psalm 42:11', theme: 'hope' },
  { text: 'When my father and my mother forsake me, then the LORD will take me up.', ref: 'Psalm 27:10', theme: 'belonging' },
  { text: 'The LORD is my light and my salvation; whom shall I fear?', ref: 'Psalm 27:1', theme: 'courage' },
  { text: 'He brought me up also out of an horrible pit, out of the miry clay, and set my feet upon a rock.', ref: 'Psalm 40:2', theme: 'deliverance' },
  { text: 'Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.', ref: 'Psalm 37:5', theme: 'trust' },
  { text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.', ref: 'Psalm 37:23', theme: 'guidance' },
  { text: 'Except the LORD build the house, they labour in vain that build it.', ref: 'Psalm 127:1', theme: 'foundation' },
];

export const QUOTES: Quote[] = [
  { text: 'Thou hast made us for thyself, O Lord, and our heart is restless until it finds its rest in thee.', author: 'St. Augustine of Hippo' },
  { text: 'Pray as though everything depended on God. Work as though everything depended on you.', author: 'Attributed to St. Augustine' },
  { text: 'Have patience with all things, but first of all with yourself.', author: 'St. Francis de Sales' },
  { text: 'Let nothing disturb you, let nothing frighten you. All things are passing; God never changes.', author: 'St. Teresa of Avila' },
  { text: 'Christ has no body now on earth but yours, no hands but yours, no feet but yours.', author: 'Attributed to St. Teresa of Avila' },
  { text: 'Start by doing what is necessary; then do what is possible; and suddenly you are doing the impossible.', author: 'Attributed to St. Francis of Assisi' },
  { text: 'All the darkness in the world cannot extinguish the light of a single candle.', author: 'Attributed to St. Francis of Assisi' },
  { text: 'Be who God meant you to be and you will set the world on fire.', author: 'St. Catherine of Siena' },
  { text: 'Pray, hope, and don\'t worry.', author: 'St. Padre Pio' },
  { text: 'Do small things with great love.', author: 'Attributed to St. Teresa of Calcutta' },
  { text: 'If you want peace, work for justice.', author: 'Pope St. Paul VI' },
  { text: 'Do not abandon yourselves to despair. We are the Easter people and hallelujah is our song.', author: 'Pope St. John Paul II' },
  { text: 'Be not afraid.', author: 'Pope St. John Paul II' },
  { text: 'Courage is not simply one of the virtues, but the form of every virtue at the testing point.', author: 'C. S. Lewis' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'Attributed to C. S. Lewis' },
  { text: 'Faith is taking the first step even when you don\'t see the whole staircase.', author: 'Attributed to Martin Luther King Jr.' },
  { text: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.', author: 'Martin Luther King Jr.' },
  { text: 'Life\'s most persistent and urgent question is, What are you doing for others?', author: 'Martin Luther King Jr.' },
  { text: 'There is no pit so deep that God\'s love is not deeper still.', author: 'Betsie ten Boom, as recorded by Corrie ten Boom' },
  { text: 'Never be afraid to trust an unknown future to a known God.', author: 'Corrie ten Boom' },
  { text: 'Worry does not empty tomorrow of its sorrow; it empties today of its strength.', author: 'Corrie ten Boom' },
  { text: 'Action springs not from thought, but from a readiness for responsibility.', author: 'Dietrich Bonhoeffer' },
  { text: 'The ultimate test of a moral society is the kind of world that it leaves to its children.', author: 'Dietrich Bonhoeffer' },
  { text: 'With malice toward none, with charity for all ... to care for him who shall have borne the battle, and for his widow, and his orphan.', author: 'Abraham Lincoln, Second Inaugural Address' },
  { text: 'The willingness with which our young people are likely to serve in any war ... shall be directly proportional to how they perceive the veterans of earlier wars were treated.', author: 'Attributed to George Washington' },
  { text: 'It is not the critic who counts ... The credit belongs to the man who is actually in the arena.', author: 'Theodore Roosevelt' },
  { text: 'Courage is fear holding on a minute longer.', author: 'Gen. George S. Patton' },
  { text: 'The soldier above all others prays for peace, for it is the soldier who must suffer and bear the deepest wounds and scars of war.', author: 'Gen. Douglas MacArthur' },
  { text: 'I will never leave a fallen comrade.', author: 'The Soldier\'s Creed' },
  { text: 'I will always place the mission first. I will never accept defeat. I will never quit.', author: 'The Soldier\'s Creed' },
  { text: 'No one is more professional than I.', author: 'The NCO Creed' },
  { text: 'Prayer is the key of the morning and the bolt of the evening.', author: 'Attributed to Mahatma Gandhi' },
  { text: 'God does not ask us to be successful, but to be faithful.', author: 'Attributed to St. Teresa of Calcutta' },
  { text: 'The greatest disease in the West today is not TB or leprosy; it is being unwanted, unloved, and uncared for.', author: 'St. Teresa of Calcutta' },
  { text: 'Until he extends the circle of his compassion to all living things, man will not himself find peace.', author: 'Albert Schweitzer' },
  { text: 'Grace does not destroy nature, but perfects it.', author: 'St. Thomas Aquinas' },
  { text: 'To one who has faith, no explanation is necessary. To one without faith, no explanation is possible.', author: 'Attributed to St. Thomas Aquinas' },
  { text: 'Lord, make me an instrument of your peace.', author: 'Prayer of St. Francis' },
  { text: 'It is in giving that we receive; it is in pardoning that we are pardoned.', author: 'Prayer of St. Francis' },
  { text: 'God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.', author: 'Reinhold Niebuhr (Serenity Prayer)' },
  { text: 'We are not human beings having a spiritual experience. We are spiritual beings having a human experience.', author: 'Attributed to Pierre Teilhard de Chardin' },
  { text: 'Above all, trust in the slow work of God.', author: 'Pierre Teilhard de Chardin, S.J.' },
  { text: 'You have not lived today until you have done something for someone who can never repay you.', author: 'John Bunyan' },
  { text: 'Do all the good you can, by all the means you can, in all the ways you can, as long as ever you can.', author: 'Attributed to John Wesley' },
  { text: 'Expect great things from God; attempt great things for God.', author: 'William Carey' },
  { text: 'God is most glorified in us when we are most satisfied in him.', author: 'John Piper' },
  { text: 'Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.', author: 'Helen Keller' },
  { text: 'Although the world is full of suffering, it is full also of the overcoming of it.', author: 'Helen Keller' },
  { text: 'Not all of us can do great things. But we can do small things with great love.', author: 'Attributed to St. Teresa of Calcutta' },
  { text: 'The dog is a gentleman; I hope to go to his heaven, not man\'s.', author: 'Mark Twain' },
  { text: 'Dogs do speak, but only to those who know how to listen.', author: 'Orhan Pamuk' },
  { text: 'He is your friend, your partner, your defender, your dog. You are his life, his love, his leader.', author: 'Traditional handler\'s saying' },
  { text: 'Love the animals: God has given them the rudiments of thought and joy untroubled.', author: 'Fyodor Dostoevsky, The Brothers Karamazov' },
  { text: 'Not all wounds are visible.', author: 'Veteran community saying' },
  { text: 'It takes more courage to reveal insecurities than to hide them.', author: 'Veteran peer-support saying' },
  { text: 'Hope is being able to see that there is light despite all of the darkness.', author: 'Attributed to Desmond Tutu' },
  { text: 'Do your little bit of good where you are; it is those little bits of good put together that overwhelm the world.', author: 'Desmond Tutu' },
  { text: 'The task ahead of us is never as great as the Power behind us.', author: 'Attributed to Ralph Waldo Emerson' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche, quoted by Viktor Frankl' },
  { text: 'When we are no longer able to change a situation, we are challenged to change ourselves.', author: 'Viktor Frankl' },
  { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Attributed to Mahatma Gandhi' },
  { text: 'Our greatest glory is not in never falling, but in rising every time we fall.', author: 'Attributed to Confucius' },
  { text: 'Let us run with patience the race that is set before us.', author: 'Hebrews 12:1' },
  { text: 'Once a warrior, always a warrior. Now you fight for peace.', author: 'Faith Forward' },
  { text: 'We provide the map; you find the way. And we walk it with you.', author: 'Faith Forward' },
  { text: 'Spiritus Invictus. Your spirit was never conquered, only wounded. Wounds heal.', author: 'Faith Forward' },
  { text: 'No veteran left behind. No dog left behind. No soul left unprayed-for.', author: 'Faith Forward' },
  { text: 'The leash runs both ways: you lead your dog, and your dog leads you home.', author: 'Faith Forward K9 Program' },
  { text: 'Every morning is a new muster. Report in to God; He has been waiting.', author: 'Rev. Mr. Paul Moore' },
  { text: 'I was lost on the same streets I now serve. Grace found me there, and it will find you too.', author: 'Rev. Mr. Paul Moore' },
];

export const PRAYERS: Prayer[] = [
  { title: 'Morning Muster', text: 'Lord God, I report for duty this morning. You know my strengths and every wound I carry. Give me orders for today: whom to help, where to go, what to say. Keep my eyes open for the veteran on the corner and the animal at his side. Let me serve as You served, without counting the cost. Amen.' },
  { text: 'Heavenly Father, watch over every veteran who woke up cold this morning, under a bridge, in a car, or on a friend\'s floor. Warm them. Feed them. Send someone, send me, to remind them they are not forgotten. Through Christ our Lord. Amen.', title: 'For the Unhoused Veteran' },
  { title: 'For Those Who Walk Beside Us', text: 'Creator of every living thing, You gave us dogs as companions, guardians, and healers. Bless the animals who stay loyal when the world walks away. Grant them health, food, and shelter, and give their handlers patience and wisdom to care for them well. Amen.' },
  { title: 'Prayer of a Handler', text: 'Lord, make me a calm leader for the dog You placed in my care. Let my hands be gentle, my voice steady, my commands clear. Teach me to read what she cannot say. Let us be a team that brings peace wherever we go. Amen.' },
  { title: 'For the Fallen', text: 'Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. We remember our brothers and sisters who did not come home. Hold them in Your peace, comfort the families they left, and make us worthy of their sacrifice. Amen.' },
  { title: 'Against the Night', text: 'Lord Jesus, when the memories come at night, stand watch over me. Quiet the noise in my head. Replace fear with Your peace and the darkness with Your light. When I cannot sleep, let me rest in You. Amen.' },
  { title: 'For Moral Injury', text: 'Merciful God, You see the things I did and the things I could not stop. I lay them at the foot of the Cross. Where I need forgiveness, forgive me. Where I need to forgive, give me the strength. Restore my conscience and make me whole again. Amen.' },
  { title: 'For Families', text: 'Holy Family of Nazareth, who knew exile and life on the road, protect the spouses and children of our veterans. Hold together the homes strained by deployment, injury, and loss. Teach us how to come home to each other. Amen.' },
  { title: 'St. Michael the Archangel', text: 'St. Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.' },
  { title: 'For Recovery', text: 'Lord, one day at a time is all I can carry. Keep me sober today. Keep me honest today. Surround me with people who will tell me the truth and walk beside me. When I fall, lift me without shame. Amen.' },
  { title: 'For Our Donors', text: 'Generous God, bless every hand that dropped off a backpack, a coat, a bag of dog food, or a rosary. Multiply their gifts as You multiplied the loaves. Return their kindness to them a hundredfold. Amen.' },
  { title: 'For Volunteers', text: 'Lord of the harvest, thank You for the laborers You sent. Strengthen their backs, soften their hearts, and protect them as they go into the streets. Let every veteran they meet see Your face in theirs. Amen.' },
  { title: 'For the Caregiver', text: 'Lord, I am tired. Caring for others has emptied me. Fill me again. Remind me that I am not the Savior, only His servant. Give me rest without guilt and strength without pride. Amen.' },
  { title: 'Before Outreach', text: 'Lord, we are going out now. Go before us. Prepare the hearts of the people we will meet. Keep us safe, keep us humble, keep us kind. Let no one we meet today feel judged, only loved. Amen.' },
  { title: 'After Outreach', text: 'Father, we bring back to You everyone we met today: their names, their stories, their needs. What we could not fix, we entrust to You. Watch over them tonight. Amen.' },
  { title: 'For the Lonely', text: 'Lord, so many of our veterans are alone in a crowd. Break the isolation. Bring a friend, a phone call, a knock at the door. Let them know they still belong to a unit: Yours. Amen.' },
  { title: 'For Healing of Body', text: 'Divine Physician, touch the bodies broken in service: the knees, the backs, the burned lungs, the injured minds. Guide the hands of the doctors and nurses at the VA. Grant healing where it is Your will, and grace to carry what remains. Amen.' },
  { title: 'For Mental Health', text: 'God of peace, we pray for every veteran fighting depression, PTSD, anxiety, or thoughts of ending their life. Hold them back from the edge. Lead them to help. Let them hear clearly: stay, you are needed, you are loved. Amen.' },
  { title: 'For Our Animals\' Health', text: 'Lord, bless the veterinarians and techs who care for our dogs. Protect our animals from sickness and injury. Give them long, healthy lives at our sides. Amen.' },
  { title: 'For Leaders', text: 'Lord, give wisdom to those who lead this foundation. Keep us honest with every dollar, faithful to our mission, and humble in our success. Let us lead as servants, never as lords. Amen.' },
  { title: 'For St. Louis', text: 'Lord, bless our city: its neighborhoods, its parishes, its streets and shelters. Heal what divides us. Make St. Louis a place where no veteran is a stranger. Amen.' },
  { title: 'For Partners', text: 'Father, bless the counselors, clinicians, case managers, and outreach workers we partner with. Give them endurance, insight, and compassion, and let our work together save lives. Amen.' },
  { title: 'Prayer for Courage', text: 'Lord, I am afraid of what today holds. You told Joshua to be strong and courageous because You were with him. Be with me the same way. Amen.' },
  { title: 'Prayer of Surrender', text: 'Lord, I have tried to carry it all myself and it is crushing me. Today I surrender command. You lead; I will follow. Amen.' },
  { title: 'For Gratitude', text: 'Thank You, Lord, for the breath in my lungs, the food in my bowl, the roof I may or may not have, the dog at my feet, and the people who did not give up on me. Teach me to be grateful in every circumstance. Amen.' },
  { title: 'Evening Watch', text: 'Lord, the day is done. I hand the watch over to You. Forgive what I did wrong, bless what I did right, and guard me and mine through the night. Amen.' },
  { title: 'For the Incarcerated Veteran', text: 'Lord Jesus, You said, I was in prison and you came to me. Be with every veteran behind bars tonight. Give them hope, a path to redemption, and people waiting for them when they come home. Amen.' },
  { title: 'For Women Veterans', text: 'Lord, we lift up the women who served, often unseen and unthanked. Heal wounds that no one else knows about. Surround them with safety, dignity, and sisterhood. Amen.' },
  { title: 'For Young Veterans', text: 'Lord, guide the young men and women just coming out of uniform. Give them purpose, good mentors, and a mission worthy of their training. Keep them from the traps that caught so many before them. Amen.' },
  { title: 'For Elderly Veterans', text: 'Lord, bless the old soldiers: Vietnam, Korea, the last of the Greatest Generation. Let them be honored, visited, and cared for. Let them see that their service still matters. Amen.' },
  { title: 'Before a Training Session', text: 'Lord, bless this training session. Give me patience and clear signals, and give my dog focus and joy. Keep us both safe. Let today build trust between us. Amen.' },
  { title: 'For a Sick or Injured Dog', text: 'Father, my dog is hurting and I cannot fix it. Guide the vet\'s hands. Ease the pain. If it is time to let go, give me the courage to choose mercy. Amen.' },
  { title: 'For Those Who Lost a Dog', text: 'Lord, You see the grief of a handler who lost a faithful companion. Comfort that sorrow. Thank You for the years of loyalty and love. Amen.' },
  { title: 'For Peace Between Nations', text: 'Prince of Peace, end the wars that make new veterans every year. Turn swords into plowshares. Protect those serving now, and bring them home whole. Amen.' },
  { title: 'For Those Serving Now', text: 'Lord, protect our service members deployed today. Cover them with Your hand, keep them faithful to one another, and bring them home in body, mind, and spirit. Amen.' },
  { title: 'For Employment', text: 'Lord, You gave us work as a blessing. Open doors of employment for veterans looking for a job. Let employers see the value of their discipline and skill. Amen.' },
  { title: 'For Housing', text: 'Lord, foxes have holes and birds have nests, and You had nowhere to lay Your head. Provide a home for every veteran without one. Move landlords, agencies, and churches to make room. Amen.' },
  { title: 'For the Hungry', text: 'Lord, You fed the five thousand. Feed our veterans and their families today. Let no one go to bed hungry in this city of plenty. Amen.' },
  { title: 'For Forgiveness of Others', text: 'Lord, I am still angry at people who hurt me: in the service, in my family, on the street. I cannot forgive them on my own. Do it through me. Set me free. Amen.' },
  { title: 'For Hope', text: 'God of hope, fill me with joy and peace as I trust in You, so that I may overflow with hope by the power of the Holy Spirit. Amen.' },
  { title: 'For Discernment', text: 'Holy Spirit, I do not know what to do next. Give me a clear mind and a quiet heart to hear Your direction. Close the wrong doors and open the right ones. Amen.' },
  { title: 'For Our Enemies', text: 'Lord, You told us to love our enemies and pray for those who persecute us. It is the hardest order You have given. Help me obey it today. Amen.' },
  { title: 'Memorare', text: 'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thine intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.' },
  { title: 'The Lord\'s Prayer', text: 'Our Father, which art in heaven, hallowed be thy Name. Thy kingdom come. Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our trespasses, as we forgive them that trespass against us. And lead us not into temptation; but deliver us from evil. Amen.' },
  { title: 'Prayer of St. Francis', text: 'Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy. For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in dying that we are born to eternal life. Amen.' },
  { title: 'Anima Christi', text: 'Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within thy wounds hide me. Suffer me not to be separated from thee. From the malicious enemy defend me. In the hour of my death call me, and bid me come unto thee, that with thy saints I may praise thee for ever and ever. Amen.' },
  { title: 'Psalm 91 Prayer', text: 'Lord, I dwell in Your shelter and rest in Your shadow. You are my refuge and my fortress. Cover me with Your feathers; let Your faithfulness be my shield. A thousand may fall at my side, but You keep watch over me. Amen.' },
  { title: 'For the Deacon\'s Ministry', text: 'Lord, You called me to serve at Your table and in the streets. Let my diaconate be real: in the soup line, at the bedside, beside the tent. Keep me a servant first. Amen.' },
  { title: 'For the Grieving', text: 'Lord, comfort those who mourn today: Gold Star families, battle buddies, children who lost a parent. Sit with them in the ashes. Promise them morning. Amen.' },
  { title: 'For Our Foundation', text: 'Lord, Faith Forward is Yours, not mine. Build it as You will. Send the right people, the right partners, the right resources. Protect it from pride and waste. Let it outlive me and keep serving. Amen.' },
  { title: 'For Justice', text: 'God of justice, open the doors of benefits, healthcare, and housing that bureaucracy has closed. Speed up delayed claims. Give advocates persistence and officials compassion. Amen.' },
  { title: 'For Children of Veterans', text: 'Lord, protect the children who grew up with a parent at war or a parent wounded by it. Heal their fears, bless their futures, and give them pride in their family\'s service. Amen.' },
  { title: 'Prayer in Winter', text: 'Lord, it is cold tonight. Cover every veteran sleeping outside. Lead them to warming centers, blankets, and open doors. Keep their dogs warm beside them. Let no one freeze in the dark. Amen.' },
  { title: 'Prayer in Summer Heat', text: 'Lord, the heat is dangerous today. Give water to the thirsty and shade to those outside. Protect our animals\' paws on the hot pavement. Lead people to cooling centers. Amen.' },
  { title: 'For Peace of Mind', text: 'Lord, my thoughts are running in circles. Speak Your peace. Let me take one breath, then another, and know You are God and I am not. Amen.' },
  { title: 'For Brotherhood', text: 'Lord, thank You for my battle buddies, past and present. Keep us faithful to one another. Let us check on each other, pick up the phone, and never let one of us fight alone. Amen.' },
  { title: 'Act of Contrition', text: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasion of sin. Amen.' },
  { title: 'For a New Beginning', text: 'Lord, today is day one. Whatever yesterday held, wipe the slate clean. Give me one good thing to do today and the strength to do it. Amen.' },
  { title: 'For Trust in Provision', text: 'Lord, I don\'t know where tomorrow\'s food, rent, or gas money will come from. You clothe the lilies and feed the sparrows; You will not forget me. Amen.' },
  { title: 'For Humility', text: 'Lord, keep me low. Let me never think I am better than the man on the corner; I have been him. Let gratitude, not pride, drive this work. Amen.' },
  { title: 'For Those Who Serve the Animals', text: 'Lord, bless the trainers, shelter workers, fosters, and vets who serve the animals of the poor. Reward their compassion and supply what they need. Amen.' },
  { title: 'Prayer of Blessing for Donations', text: 'Lord God, bless these gifts and the hands that gave them. May every backpack carry hope, every coat bring warmth, every meal strengthen, and every prayer item draw its owner closer to You. Amen.' },
  { title: 'For Strength in Weakness', text: 'Lord, my body is not what it was. My mind is not what it was. But Your grace is enough, and Your strength is made perfect in my weakness. Use me anyway. Amen.' },
  { title: 'For Holy Fear', text: 'Lord, give me reverence for You and courage before men. Let me fear nothing but losing You. Amen.' },
  { title: 'Night Prayer', text: 'Protect us, Lord, as we stay awake; watch over us as we sleep, that awake, we may keep watch with Christ, and asleep, rest in His peace. Amen.' },
  { title: 'For Purpose', text: 'Lord, I miss the mission. Show me the mission You have for me now. Give me a reason to get up and a team to serve alongside. Amen.' },
  { title: 'For Patience', text: 'Lord, the VA is slow, the paperwork is endless, the system is broken. Give me patience to keep showing up and wisdom to know when to push. Amen.' },
  { title: 'For Those Who Have Given Up on God', text: 'Lord, many of our veterans came home angry at You. You can handle their anger. Pursue them anyway, gently, until they know they were never abandoned. Amen.' },
  { title: 'Glory Be', text: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.' },
  { title: 'For Joy', text: 'Lord, it has been a long time since I laughed. Restore the joy of my salvation. Let me enjoy a sunrise, a good meal, a dog\'s happy tail. Amen.' },
  { title: 'Commissioning Prayer', text: 'Lord, You call us from the streets to send us back into them. Commission us today as ambassadors of Your mercy. Here am I, Lord. Send me. Amen.' },
];

// Fixed-date observances (MM-DD). Moveable feasts are computed below.
const FIXED: Record<string, { feast: string; verse?: Verse; prayer?: Prayer }> = {
  '01-01': { feast: 'Solemnity of Mary, Mother of God / New Year\'s Day', verse: VERSES.find((v) => v.ref === 'Isaiah 43:18-19') },
  '01-20': { feast: 'Feast of St. Sebastian, patron of soldiers' },
  '02-02': { feast: 'Presentation of the Lord' },
  '03-17': { feast: 'Feast of St. Patrick' },
  '03-19': { feast: 'Solemnity of St. Joseph, protector of families' },
  '05-30': { feast: 'Feast of St. Joan of Arc, patroness of soldiers' },
  '06-14': { feast: 'Flag Day & U.S. Army Birthday' },
  '07-04': { feast: 'Independence Day', verse: VERSES.find((v) => v.ref === 'John 8:32') },
  '08-07': { feast: 'Purple Heart Day' },
  '09-11': { feast: 'Patriot Day: remembering 9/11', prayer: PRAYERS.find((p) => p.title === 'For the Fallen') },
  '09-29': { feast: 'Feast of Sts. Michael, Gabriel & Raphael, Archangels', prayer: PRAYERS.find((p) => p.title === 'St. Michael the Archangel') },
  '10-04': { feast: 'Feast of St. Francis of Assisi: Blessing of the Animals', prayer: PRAYERS.find((p) => p.title === 'For Those Who Walk Beside Us'), verse: VERSES.find((v) => v.ref === 'Proverbs 12:10') },
  '11-01': { feast: 'All Saints\' Day' },
  '11-02': { feast: 'All Souls\' Day', prayer: PRAYERS.find((p) => p.title === 'For the Fallen') },
  '11-11': { feast: 'Veterans Day & Feast of St. Martin of Tours, soldier-saint', verse: VERSES.find((v) => v.ref === '2 Timothy 4:7') },
  '12-07': { feast: 'Pearl Harbor Remembrance Day', prayer: PRAYERS.find((p) => p.title === 'For the Fallen') },
  '12-08': { feast: 'Solemnity of the Immaculate Conception' },
  '12-24': { feast: 'Christmas Eve', verse: { text: 'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.', ref: 'Luke 2:11', theme: 'nativity' } },
  '12-25': { feast: 'The Nativity of the Lord (Christmas)', verse: { text: 'And the Word was made flesh, and dwelt among us.', ref: 'John 1:14', theme: 'nativity' } },
};

// Anonymous Gregorian algorithm for Western Easter.
export function easter(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function lastMondayOfMay(year: number): Date {
  const d = new Date(year, 4, 31);
  while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
  return d;
}

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function moveable(d: Date): { feast: string; verse?: Verse } | undefined {
  const e = easter(d.getFullYear());
  if (sameDay(d, e)) return { feast: 'Easter Sunday: He is Risen', verse: { text: 'He is not here: for he is risen, as he said.', ref: 'Matthew 28:6', theme: 'resurrection' } };
  if (sameDay(d, addDays(e, -2))) return { feast: 'Good Friday', verse: { text: 'But he was wounded for our transgressions, he was bruised for our iniquities ... and with his stripes we are healed.', ref: 'Isaiah 53:5', theme: 'sacrifice' } };
  if (sameDay(d, addDays(e, -46))) return { feast: 'Ash Wednesday', verse: VERSES.find((v) => v.ref === 'Psalm 51:10') };
  if (sameDay(d, addDays(e, -7))) return { feast: 'Palm Sunday' };
  if (sameDay(d, addDays(e, 49))) return { feast: 'Pentecost Sunday' };
  if (sameDay(d, lastMondayOfMay(d.getFullYear()))) return { feast: 'Memorial Day: we remember', verse: VERSES.find((v) => v.ref === 'John 15:13') };
  return undefined;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function devotionalFor(date = new Date()): Devotional {
  // Days since a fixed epoch, so consecutive days walk each pool in order.
  const n = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  let verse = VERSES[n % VERSES.length];
  let prayer = PRAYERS[n % PRAYERS.length];
  const quote = QUOTES[n % QUOTES.length];
  const fixed = FIXED[`${pad(date.getMonth() + 1)}-${pad(date.getDate())}`];
  const mv = moveable(date);
  const feast = mv?.feast ?? fixed?.feast;
  verse = mv?.verse ?? fixed?.verse ?? verse;
  prayer = fixed?.prayer ?? prayer;
  return { date: isoDate(date), verse, quote, prayer, feast };
}
