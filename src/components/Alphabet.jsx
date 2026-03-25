import { useEffect, useState } from 'react'
import './Alphabet.css'

// Default sample data for fallback
const DEFAULT_HIRAGANA = [
  { alphabetId: 1, character: 'あ', type: 'Hiragana', level: '1', meaning: 'a' },
  { alphabetId: 2, character: 'い', type: 'Hiragana', level: '1', meaning: 'i' },
  { alphabetId: 3, character: 'う', type: 'Hiragana', level: '1', meaning: 'u' },
  { alphabetId: 4, character: 'え', type: 'Hiragana', level: '1', meaning: 'e' },
  { alphabetId: 5, character: 'お', type: 'Hiragana', level: '1', meaning: 'o' },
  { alphabetId: 6, character: 'か', type: 'Hiragana', level: '1', meaning: 'ka' },
  { alphabetId: 7, character: 'き', type: 'Hiragana', level: '1', meaning: 'ki' },
  { alphabetId: 8, character: 'く', type: 'Hiragana', level: '1', meaning: 'ku' },
  { alphabetId: 9, character: 'け', type: 'Hiragana', level: '1', meaning: 'ke' },
  { alphabetId: 10, character: 'こ', type: 'Hiragana', level: '1', meaning: 'ko' },
  { alphabetId: 11, character: 'さ', type: 'Hiragana', level: '2', meaning: 'sa' },
  { alphabetId: 12, character: 'し', type: 'Hiragana', level: '2', meaning: 'shi' },
  { alphabetId: 13, character: 'す', type: 'Hiragana', level: '2', meaning: 'su' },
  { alphabetId: 14, character: 'せ', type: 'Hiragana', level: '2', meaning: 'se' },
  { alphabetId: 15, character: 'そ', type: 'Hiragana', level: '2', meaning: 'so' },
  { alphabetId: 16, character: 'た', type: 'Hiragana', level: '2', meaning: 'ta' },
  { alphabetId: 17, character: 'ち', type: 'Hiragana', level: '2', meaning: 'chi' },
  { alphabetId: 18, character: 'つ', type: 'Hiragana', level: '2', meaning: 'tsu' },
  { alphabetId: 19, character: 'て', type: 'Hiragana', level: '2', meaning: 'te' },
  { alphabetId: 20, character: 'と', type: 'Hiragana', level: '2', meaning: 'to' },
  { alphabetId: 21, character: 'な', type: 'Hiragana', level: '3', meaning: 'na' },
  { alphabetId: 22, character: 'に', type: 'Hiragana', level: '3', meaning: 'ni' },
  { alphabetId: 23, character: 'ぬ', type: 'Hiragana', level: '3', meaning: 'nu' },
  { alphabetId: 24, character: 'ね', type: 'Hiragana', level: '3', meaning: 'ne' },
  { alphabetId: 25, character: 'の', type: 'Hiragana', level: '3', meaning: 'no' },
  { alphabetId: 26, character: 'は', type: 'Hiragana', level: '3', meaning: 'ha' },
  { alphabetId: 27, character: 'ひ', type: 'Hiragana', level: '3', meaning: 'hi' },
  { alphabetId: 28, character: 'ふ', type: 'Hiragana', level: '3', meaning: 'fu' },
  { alphabetId: 29, character: 'へ', type: 'Hiragana', level: '3', meaning: 'he' },
  { alphabetId: 30, character: 'ほ', type: 'Hiragana', level: '3', meaning: 'ho' },
  { alphabetId: 31, character: 'ま', type: 'Hiragana', level: '4', meaning: 'ma' },
  { alphabetId: 32, character: 'み', type: 'Hiragana', level: '4', meaning: 'mi' },
  { alphabetId: 33, character: 'む', type: 'Hiragana', level: '4', meaning: 'mu' },
  { alphabetId: 34, character: 'め', type: 'Hiragana', level: '4', meaning: 'me' },
  { alphabetId: 35, character: 'も', type: 'Hiragana', level: '4', meaning: 'mo' },
  { alphabetId: 36, character: 'や', type: 'Hiragana', level: '4', meaning: 'ya' },
  { alphabetId: 37, character: 'ゆ', type: 'Hiragana', level: '4', meaning: 'yu' },
  { alphabetId: 38, character: 'よ', type: 'Hiragana', level: '4', meaning: 'yo' },
  { alphabetId: 39, character: 'ら', type: 'Hiragana', level: '5', meaning: 'ra' },
  { alphabetId: 40, character: 'り', type: 'Hiragana', level: '5', meaning: 'ri' },
  { alphabetId: 41, character: 'る', type: 'Hiragana', level: '5', meaning: 'ru' },
  { alphabetId: 42, character: 'れ', type: 'Hiragana', level: '5', meaning: 're' },
  { alphabetId: 43, character: 'ろ', type: 'Hiragana', level: '5', meaning: 'ro' },
  { alphabetId: 44, character: 'わ', type: 'Hiragana', level: '5', meaning: 'wa' },
  { alphabetId: 45, character: 'を', type: 'Hiragana', level: '5', meaning: 'wo' },
  { alphabetId: 46, character: 'ん', type: 'Hiragana', level: '5', meaning: 'n' }
]

const DEFAULT_KATAKANA = [
  { alphabetId: 51, character: 'ア', type: 'Katakana', level: '1', meaning: 'a' },
  { alphabetId: 52, character: 'イ', type: 'Katakana', level: '1', meaning: 'i' },
  { alphabetId: 53, character: 'ウ', type: 'Katakana', level: '1', meaning: 'u' },
  { alphabetId: 54, character: 'エ', type: 'Katakana', level: '1', meaning: 'e' },
  { alphabetId: 55, character: 'オ', type: 'Katakana', level: '1', meaning: 'o' },
  { alphabetId: 56, character: 'カ', type: 'Katakana', level: '1', meaning: 'ka' },
  { alphabetId: 57, character: 'キ', type: 'Katakana', level: '1', meaning: 'ki' },
  { alphabetId: 58, character: 'ク', type: 'Katakana', level: '1', meaning: 'ku' },
  { alphabetId: 59, character: 'ケ', type: 'Katakana', level: '1', meaning: 'ke' },
  { alphabetId: 60, character: 'コ', type: 'Katakana', level: '1', meaning: 'ko' },
  { alphabetId: 61, character: 'サ', type: 'Katakana', level: '2', meaning: 'sa' },
  { alphabetId: 62, character: 'シ', type: 'Katakana', level: '2', meaning: 'shi' },
  { alphabetId: 63, character: 'ス', type: 'Katakana', level: '2', meaning: 'su' },
  { alphabetId: 64, character: 'セ', type: 'Katakana', level: '2', meaning: 'se' },
  { alphabetId: 65, character: 'ソ', type: 'Katakana', level: '2', meaning: 'so' },
  { alphabetId: 66, character: 'タ', type: 'Katakana', level: '2', meaning: 'ta' },
  { alphabetId: 67, character: 'チ', type: 'Katakana', level: '2', meaning: 'chi' },
  { alphabetId: 68, character: 'ツ', type: 'Katakana', level: '2', meaning: 'tsu' },
  { alphabetId: 69, character: 'テ', type: 'Katakana', level: '2', meaning: 'te' },
  { alphabetId: 70, character: 'ト', type: 'Katakana', level: '2', meaning: 'to' },
  { alphabetId: 71, character: 'ナ', type: 'Katakana', level: '3', meaning: 'na' },
  { alphabetId: 72, character: 'ニ', type: 'Katakana', level: '3', meaning: 'ni' },
  { alphabetId: 73, character: 'ヌ', type: 'Katakana', level: '3', meaning: 'nu' },
  { alphabetId: 74, character: 'ネ', type: 'Katakana', level: '3', meaning: 'ne' },
  { alphabetId: 75, character: 'ノ', type: 'Katakana', level: '3', meaning: 'no' },
  { alphabetId: 76, character: 'ハ', type: 'Katakana', level: '3', meaning: 'ha' },
  { alphabetId: 77, character: 'ヒ', type: 'Katakana', level: '3', meaning: 'hi' },
  { alphabetId: 78, character: 'フ', type: 'Katakana', level: '3', meaning: 'fu' },
  { alphabetId: 79, character: 'ヘ', type: 'Katakana', level: '3', meaning: 'he' },
  { alphabetId: 80, character: 'ホ', type: 'Katakana', level: '3', meaning: 'ho' },
  { alphabetId: 81, character: 'マ', type: 'Katakana', level: '4', meaning: 'ma' },
  { alphabetId: 82, character: 'ミ', type: 'Katakana', level: '4', meaning: 'mi' },
  { alphabetId: 83, character: 'ム', type: 'Katakana', level: '4', meaning: 'mu' },
  { alphabetId: 84, character: 'メ', type: 'Katakana', level: '4', meaning: 'me' },
  { alphabetId: 85, character: 'モ', type: 'Katakana', level: '4', meaning: 'mo' },
  { alphabetId: 86, character: 'ヤ', type: 'Katakana', level: '4', meaning: 'ya' },
  { alphabetId: 87, character: 'ユ', type: 'Katakana', level: '4', meaning: 'yu' },
  { alphabetId: 88, character: 'ヨ', type: 'Katakana', level: '4', meaning: 'yo' },
  { alphabetId: 89, character: 'ラ', type: 'Katakana', level: '5', meaning: 'ra' },
  { alphabetId: 90, character: 'リ', type: 'Katakana', level: '5', meaning: 'ri' },
  { alphabetId: 91, character: 'ル', type: 'Katakana', level: '5', meaning: 'ru' },
  { alphabetId: 92, character: 'レ', type: 'Katakana', level: '5', meaning: 're' },
  { alphabetId: 93, character: 'ロ', type: 'Katakana', level: '5', meaning: 'ro' },
  { alphabetId: 94, character: 'ワ', type: 'Katakana', level: '5', meaning: 'wa' },
  { alphabetId: 95, character: 'ヲ', type: 'Katakana', level: '5', meaning: 'wo' },
  { alphabetId: 96, character: 'ン', type: 'Katakana', level: '5', meaning: 'n' }
]

const DEFAULT_KANJI_N5 = [
  { alphabetId: 101, character: '日', type: 'Kanji', level: 'n5', meaning: 'day, sun' },
  { alphabetId: 102, character: '月', type: 'Kanji', level: 'n5', meaning: 'moon, month' },
  { alphabetId: 103, character: '火', type: 'Kanji', level: 'n5', meaning: 'fire' },
  { alphabetId: 104, character: '水', type: 'Kanji', level: 'n5', meaning: 'water' },
  { alphabetId: 105, character: '木', type: 'Kanji', level: 'n5', meaning: 'tree, wood' },
  { alphabetId: 106, character: '金', type: 'Kanji', level: 'n5', meaning: 'gold, money' },
  { alphabetId: 107, character: '土', type: 'Kanji', level: 'n5', meaning: 'earth' },
  { alphabetId: 108, character: '一', type: 'Kanji', level: 'n5', meaning: 'one' },
  { alphabetId: 109, character: '二', type: 'Kanji', level: 'n5', meaning: 'two' },
  { alphabetId: 110, character: '三', type: 'Kanji', level: 'n5', meaning: 'three' },
  { alphabetId: 111, character: '人', type: 'Kanji', level: 'n5', meaning: 'person' },
  { alphabetId: 112, character: '大', type: 'Kanji', level: 'n5', meaning: 'big' },
  { alphabetId: 113, character: '小', type: 'Kanji', level: 'n5', meaning: 'small' },
  { alphabetId: 114, character: '中', type: 'Kanji', level: 'n5', meaning: 'middle' },
  { alphabetId: 115, character: '本', type: 'Kanji', level: 'n5', meaning: 'origin, counter' },
  { alphabetId: 116, character: '子', type: 'Kanji', level: 'n5', meaning: 'child' },
  { alphabetId: 117, character: '女', type: 'Kanji', level: 'n5', meaning: 'woman, female' },
  { alphabetId: 118, character: '男', type: 'Kanji', level: 'n5', meaning: 'man, male' },
  { alphabetId: 119, character: '学', type: 'Kanji', level: 'n5', meaning: 'study, school' },
  { alphabetId: 120, character: '生', type: 'Kanji', level: 'n5', meaning: 'life, birth' },
  { alphabetId: 121, character: '先', type: 'Kanji', level: 'n5', meaning: 'before, prior' },
  { alphabetId: 122, character: '生', type: 'Kanji', level: 'n5', meaning: 'teacher' },
  { alphabetId: 123, character: '目', type: 'Kanji', level: 'n5', meaning: 'eye' },
  { alphabetId: 124, character: '口', type: 'Kanji', level: 'n5', meaning: 'mouth' },
  { alphabetId: 125, character: '手', type: 'Kanji', level: 'n5', meaning: 'hand' },
  { alphabetId: 126, character: '足', type: 'Kanji', level: 'n5', meaning: 'leg, foot' },
  { alphabetId: 127, character: '心', type: 'Kanji', level: 'n5', meaning: 'heart, mind' },
  { alphabetId: 128, character: '耳', type: 'Kanji', level: 'n5', meaning: 'ear' },
  { alphabetId: 129, character: '鼻', type: 'Kanji', level: 'n5', meaning: 'nose' },
  { alphabetId: 130, character: '歯', type: 'Kanji', level: 'n5', meaning: 'tooth' },
  { alphabetId: 131, character: '家', type: 'Kanji', level: 'n5', meaning: 'house, home' },
  { alphabetId: 132, character: '門', type: 'Kanji', level: 'n5', meaning: 'gate, door' },
  { alphabetId: 133, character: '窓', type: 'Kanji', level: 'n5', meaning: 'window' },
  { alphabetId: 134, character: '床', type: 'Kanji', level: 'n5', meaning: 'floor, bed' },
  { alphabetId: 135, character: '壁', type: 'Kanji', level: 'n5', meaning: 'wall' },
  { alphabetId: 136, character: '天', type: 'Kanji', level: 'n5', meaning: 'heaven, sky' },
  { alphabetId: 137, character: '地', type: 'Kanji', level: 'n5', meaning: 'earth, ground' },
  { alphabetId: 138, character: '山', type: 'Kanji', level: 'n5', meaning: 'mountain' },
  { alphabetId: 139, character: '川', type: 'Kanji', level: 'n5', meaning: 'river' },
  { alphabetId: 140, character: '海', type: 'Kanji', level: 'n5', meaning: 'sea, ocean' },
  { alphabetId: 141, character: '花', type: 'Kanji', level: 'n5', meaning: 'flower' },
  { alphabetId: 142, character: '草', type: 'Kanji', level: 'n5', meaning: 'grass, weed' },
  { alphabetId: 143, character: '鳥', type: 'Kanji', level: 'n5', meaning: 'bird' },
  { alphabetId: 144, character: '魚', type: 'Kanji', level: 'n5', meaning: 'fish' },
  { alphabetId: 145, character: '虫', type: 'Kanji', level: 'n5', meaning: 'bug, insect' },
  { alphabetId: 146, character: '牛', type: 'Kanji', level: 'n5', meaning: 'cow, cattle' },
  { alphabetId: 147, character: '馬', type: 'Kanji', level: 'n5', meaning: 'horse' },
  { alphabetId: 148, character: '犬', type: 'Kanji', level: 'n5', meaning: 'dog' },
  { alphabetId: 149, character: '猫', type: 'Kanji', level: 'n5', meaning: 'cat' },
  { alphabetId: 150, character: '米', type: 'Kanji', level: 'n5', meaning: 'rice, America' }
]

const DEFAULT_KANJI_N4 = [
  { alphabetId: 201, character: '駅', type: 'Kanji', level: 'n4', meaning: 'station' },
  { alphabetId: 202, character: '病', type: 'Kanji', level: 'n4', meaning: 'sick, illness' },
  { alphabetId: 203, character: '院', type: 'Kanji', level: 'n4', meaning: 'institution' },
  { alphabetId: 204, character: '旅', type: 'Kanji', level: 'n4', meaning: 'travel' },
  { alphabetId: 205, character: '館', type: 'Kanji', level: 'n4', meaning: 'building, hall' },
  { alphabetId: 206, character: '航', type: 'Kanji', level: 'n4', meaning: 'navigate, sail' },
  { alphabetId: 207, character: '空', type: 'Kanji', level: 'n4', meaning: 'sky, empty' },
  { alphabetId: 208, character: '港', type: 'Kanji', level: 'n4', meaning: 'harbor, port' },
  { alphabetId: 209, character: '着', type: 'Kanji', level: 'n4', meaning: 'arrive, wear' },
  { alphabetId: 210, character: '急', type: 'Kanji', level: 'n4', meaning: 'urgent, hurry' },
  { alphabetId: 211, character: '速', type: 'Kanji', level: 'n4', meaning: 'fast' },
  { alphabetId: 212, character: '遅', type: 'Kanji', level: 'n4', meaning: 'late, slow' },
  { alphabetId: 213, character: '起', type: 'Kanji', level: 'n4', meaning: 'wake up, rise' },
  { alphabetId: 214, character: '寝', type: 'Kanji', level: 'n4', meaning: 'sleep, lie down' },
  { alphabetId: 215, character: '働', type: 'Kanji', level: 'n4', meaning: 'work' },
  { alphabetId: 216, character: '残', type: 'Kanji', level: 'n4', meaning: 'remain' },
  { alphabetId: 217, character: '業', type: 'Kanji', level: 'n4', meaning: 'business, industry' },
  { alphabetId: 218, character: '練', type: 'Kanji', level: 'n4', meaning: 'practice, train' },
  { alphabetId: 219, character: '習', type: 'Kanji', level: 'n4', meaning: 'learn, practice' },
  { alphabetId: 220, character: '試', type: 'Kanji', level: 'n4', meaning: 'test, try' }
]

const DEFAULT_KANJI_N3 = [
  { alphabetId: 301, character: '政', type: 'Kanji', level: 'n3', meaning: 'politics, government' },
  { alphabetId: 302, character: '経', type: 'Kanji', level: 'n3', meaning: 'manage, economy' },
  { alphabetId: 303, character: '済', type: 'Kanji', level: 'n3', meaning: 'finish, settle' },
  { alphabetId: 304, character: '財', type: 'Kanji', level: 'n3', meaning: 'wealth, property' },
  { alphabetId: 305, character: '術', type: 'Kanji', level: 'n3', meaning: 'art, technique' },
  { alphabetId: 306, character: '科', type: 'Kanji', level: 'n3', meaning: 'department, course' },
  { alphabetId: 307, character: '研', type: 'Kanji', level: 'n3', meaning: 'research' },
  { alphabetId: 308, character: '究', type: 'Kanji', level: 'n3', meaning: 'study deeply' },
  { alphabetId: 309, character: '境', type: 'Kanji', level: 'n3', meaning: 'boundary, environment' },
  { alphabetId: 310, character: '環', type: 'Kanji', level: 'n3', meaning: 'ring, circle' },
  { alphabetId: 311, character: '資', type: 'Kanji', level: 'n3', meaning: 'resource, capital' },
  { alphabetId: 312, character: '源', type: 'Kanji', level: 'n3', meaning: 'source, origin' },
  { alphabetId: 313, character: '製', type: 'Kanji', level: 'n3', meaning: 'manufacture' },
  { alphabetId: 314, character: '品', type: 'Kanji', level: 'n3', meaning: 'goods, product' },
  { alphabetId: 315, character: '質', type: 'Kanji', level: 'n3', meaning: 'quality, nature' },
  { alphabetId: 316, character: '技', type: 'Kanji', level: 'n3', meaning: 'skill, technique' },
  { alphabetId: 317, character: '管', type: 'Kanji', level: 'n3', meaning: 'manage, pipe' },
  { alphabetId: 318, character: '理', type: 'Kanji', level: 'n3', meaning: 'reason, logic' },
  { alphabetId: 319, character: '改', type: 'Kanji', level: 'n3', meaning: 'reform, change' },
  { alphabetId: 320, character: '革', type: 'Kanji', level: 'n3', meaning: 'leather, reform' }
]

const DEFAULT_KANJI_N2 = [
  { alphabetId: 401, character: '議', type: 'Kanji', level: 'n2', meaning: 'deliberation, discussion' },
  { alphabetId: 402, character: '論', type: 'Kanji', level: 'n2', meaning: 'theory, argument' },
  { alphabetId: 403, character: '証', type: 'Kanji', level: 'n2', meaning: 'proof, evidence' },
  { alphabetId: 404, character: '拠', type: 'Kanji', level: 'n2', meaning: 'basis, grounds' },
  { alphabetId: 405, character: '複', type: 'Kanji', level: 'n2', meaning: 'duplicate, complex' },
  { alphabetId: 406, character: '雑', type: 'Kanji', level: 'n2', meaning: 'mixed, complicated' },
  { alphabetId: 407, character: '著', type: 'Kanji', level: 'n2', meaning: 'write, remarkable' },
  { alphabetId: 408, character: '訳', type: 'Kanji', level: 'n2', meaning: 'translate, reason' },
  { alphabetId: 409, character: '評', type: 'Kanji', level: 'n2', meaning: 'evaluate, criticize' },
  { alphabetId: 410, character: '判', type: 'Kanji', level: 'n2', meaning: 'judge, decide' },
  { alphabetId: 411, character: '限', type: 'Kanji', level: 'n2', meaning: 'limit' },
  { alphabetId: 412, character: '制', type: 'Kanji', level: 'n2', meaning: 'system, control' },
  { alphabetId: 413, character: '導', type: 'Kanji', level: 'n2', meaning: 'guide, lead' },
  { alphabetId: 414, character: '監', type: 'Kanji', level: 'n2', meaning: 'supervise' },
  { alphabetId: 415, character: '督', type: 'Kanji', level: 'n2', meaning: 'coach, command' },
  { alphabetId: 416, character: '維', type: 'Kanji', level: 'n2', meaning: 'maintain' },
  { alphabetId: 417, character: '持', type: 'Kanji', level: 'n2', meaning: 'hold, maintain' },
  { alphabetId: 418, character: '展', type: 'Kanji', level: 'n2', meaning: 'expand, unfold' },
  { alphabetId: 419, character: '望', type: 'Kanji', level: 'n2', meaning: 'hope, outlook' },
  { alphabetId: 420, character: '値', type: 'Kanji', level: 'n2', meaning: 'value, price' }
]

const DEFAULT_KANJI_N1 = [
  { alphabetId: 501, character: '憲', type: 'Kanji', level: 'n1', meaning: 'constitution' },
  { alphabetId: 502, character: '罰', type: 'Kanji', level: 'n1', meaning: 'penalty, punishment' },
  { alphabetId: 503, character: '権', type: 'Kanji', level: 'n1', meaning: 'authority, rights' },
  { alphabetId: 504, character: '擁', type: 'Kanji', level: 'n1', meaning: 'embrace, support' },
  { alphabetId: 505, character: '護', type: 'Kanji', level: 'n1', meaning: 'protect, defend' },
  { alphabetId: 506, character: '厳', type: 'Kanji', level: 'n1', meaning: 'strict, severe' },
  { alphabetId: 507, character: '戒', type: 'Kanji', level: 'n1', meaning: 'warn, caution' },
  { alphabetId: 508, character: '廉', type: 'Kanji', level: 'n1', meaning: 'honest, inexpensive' },
  { alphabetId: 509, character: '潔', type: 'Kanji', level: 'n1', meaning: 'clean, pure' },
  { alphabetId: 510, character: '慣', type: 'Kanji', level: 'n1', meaning: 'accustomed, habit' },
  { alphabetId: 511, character: '慮', type: 'Kanji', level: 'n1', meaning: 'consideration' },
  { alphabetId: 512, character: '繊', type: 'Kanji', level: 'n1', meaning: 'fiber, delicate' },
  { alphabetId: 513, character: '維', type: 'Kanji', level: 'n1', meaning: 'maintain' },
  { alphabetId: 514, character: '羅', type: 'Kanji', level: 'n1', meaning: 'net, spread out' },
  { alphabetId: 515, character: '網', type: 'Kanji', level: 'n1', meaning: 'net, network' },
  { alphabetId: 516, character: '緻', type: 'Kanji', level: 'n1', meaning: 'fine, precise' },
  { alphabetId: 517, character: '密', type: 'Kanji', level: 'n1', meaning: 'dense, secret' },
  { alphabetId: 518, character: '衡', type: 'Kanji', level: 'n1', meaning: 'balance, measure' },
  { alphabetId: 519, character: '閲', type: 'Kanji', level: 'n1', meaning: 'inspect, review' },
  { alphabetId: 520, character: '覧', type: 'Kanji', level: 'n1', meaning: 'look over, view' }
]

const DEFAULT_KANJI_BY_LEVEL = {
  n5: DEFAULT_KANJI_N5,
  n4: DEFAULT_KANJI_N4,
  n3: DEFAULT_KANJI_N3,
  n2: DEFAULT_KANJI_N2,
  n1: DEFAULT_KANJI_N1
}

const GOJUON_ROW_LAYOUT = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],
  ['ha', 'hi', 'fu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', null, 'yu', null, 'yo'],
  ['ra', 'ri', 'ru', 're', 'ro'],
  ['wa', null, null, null, 'wo'],
  ['n', null, null, null, null]
]

const KANJI_MEANING_VI = {
  'day, sun': 'ngày, mặt trời',
  'moon, month': 'mặt trăng, tháng',
  'fire': 'lửa',
  'water': 'nước',
  'tree, wood': 'cây, gỗ',
  'gold, money': 'vàng, tiền',
  'earth': 'đất',
  'one': 'một',
  'two': 'hai',
  'three': 'ba',
  'person': 'người',
  'big': 'to, lớn',
  'small': 'nhỏ',
  'middle': 'giữa, trung tâm',
  'origin, counter': 'gốc, đơn vị đếm',
  'child': 'trẻ em',
  'woman, female': 'phụ nữ, nữ',
  'man, male': 'đàn ông, nam',
  'study, school': 'học, trường học',
  'life, birth': 'cuộc sống, sinh ra',
  'before, prior': 'trước, trước đó',
  'teacher': 'giáo viên',
  'eye': 'mắt',
  'mouth': 'miệng',
  'hand': 'tay',
  'leg, foot': 'chân, bàn chân',
  'heart, mind': 'trái tim, tâm trí',
  'ear': 'tai',
  'nose': 'mũi',
  'tooth': 'răng',
  'house, home': 'nhà, gia đình',
  'gate, door': 'cổng, cửa',
  'window': 'cửa sổ',
  'floor, bed': 'sàn, giường',
  'wall': 'tường',
  'heaven, sky': 'bầu trời',
  'earth, ground': 'mặt đất',
  'mountain': 'núi',
  'river': 'sông',
  'sea, ocean': 'biển, đại dương',
  'flower': 'hoa',
  'grass, weed': 'cỏ',
  'bird': 'chim',
  'fish': 'cá',
  'bug, insect': 'côn trùng',
  'cow, cattle': 'bò',
  'horse': 'ngựa',
  'dog': 'chó',
  'cat': 'mèo',
  'rice, America': 'gạo, Mỹ',
  'station': 'nhà ga',
  'sick, illness': 'bệnh, ốm',
  'institution': 'viện, cơ sở',
  'travel': 'du lịch',
  'building, hall': 'tòa nhà, hội trường',
  'navigate, sail': 'điều hướng, đi thuyền',
  'sky, empty': 'bầu trời, trống rỗng',
  'harbor, port': 'cảng, bến cảng',
  'arrive, wear': 'đến nơi, mặc',
  'urgent, hurry': 'khẩn cấp, vội vàng',
  'fast': 'nhanh',
  'late, slow': 'muộn, chậm',
  'wake up, rise': 'thức dậy, đứng dậy',
  'sleep, lie down': 'ngủ, nằm xuống',
  'work': 'làm việc',
  'remain': 'còn lại',
  'business, industry': 'kinh doanh, công nghiệp',
  'practice, train': 'luyện tập, rèn luyện',
  'learn, practice': 'học, luyện tập',
  'test, try': 'kiểm tra, thử',
  'politics, government': 'chính trị, chính phủ',
  'manage, economy': 'quản lý, kinh tế',
  'finish, settle': 'hoàn tất, dàn xếp',
  'wealth, property': 'tài sản, của cải',
  'art, technique': 'nghệ thuật, kỹ thuật',
  'department, course': 'khoa, khóa học',
  'research': 'nghiên cứu',
  'study deeply': 'nghiên cứu sâu',
  'boundary, environment': 'ranh giới, môi trường',
  'ring, circle': 'vòng, hình tròn',
  'resource, capital': 'tài nguyên, vốn',
  'source, origin': 'nguồn, nguồn gốc',
  'manufacture': 'sản xuất',
  'goods, product': 'hàng hóa, sản phẩm',
  'quality, nature': 'chất lượng, bản chất',
  'skill, technique': 'kỹ năng, kỹ thuật',
  'manage, pipe': 'quản lý, ống',
  'reason, logic': 'lý do, logic',
  'reform, change': 'cải cách, thay đổi',
  'leather, reform': 'da thuộc, cải cách',
  'deliberation, discussion': 'thảo luận, nghị luận',
  'theory, argument': 'lý thuyết, lập luận',
  'proof, evidence': 'bằng chứng, chứng cứ',
  'basis, grounds': 'cơ sở, căn cứ',
  'duplicate, complex': 'trùng lặp, phức tạp',
  'mixed, complicated': 'pha tạp, phức tạp',
  'write, remarkable': 'viết, nổi bật',
  'translate, reason': 'dịch, lý do',
  'evaluate, criticize': 'đánh giá, phê bình',
  'judge, decide': 'phán xét, quyết định',
  'limit': 'giới hạn',
  'system, control': 'hệ thống, kiểm soát',
  'guide, lead': 'hướng dẫn, dẫn dắt',
  'supervise': 'giám sát',
  'coach, command': 'chỉ đạo, mệnh lệnh',
  'maintain': 'duy trì',
  'hold, maintain': 'giữ, duy trì',
  'expand, unfold': 'mở rộng, triển khai',
  'hope, outlook': 'hy vọng, triển vọng',
  'value, price': 'giá trị, giá cả',
  'constitution': 'hiến pháp',
  'penalty, punishment': 'hình phạt, trừng phạt',
  'authority, rights': 'quyền lực, quyền lợi',
  'embrace, support': 'ủng hộ, hỗ trợ',
  'protect, defend': 'bảo vệ, phòng vệ',
  'strict, severe': 'nghiêm khắc, khắc nghiệt',
  'warn, caution': 'cảnh báo, thận trọng',
  'honest, inexpensive': 'liêm chính, giá rẻ',
  'clean, pure': 'sạch sẽ, tinh khiết',
  'accustomed, habit': 'quen thuộc, thói quen',
  'consideration': 'sự cân nhắc',
  'fiber, delicate': 'sợi, tinh xảo',
  'net, spread out': 'lưới, trải rộng',
  'net, network': 'lưới, mạng lưới',
  'fine, precise': 'tinh tế, chính xác',
  'dense, secret': 'dày đặc, bí mật',
  'balance, measure': 'cân bằng, đo lường',
  'inspect, review': 'kiểm tra, xem xét',
  'look over, view': 'xem qua, quan sát'
}

const normalizeReading = (value) => (value || '').toString().trim().toLowerCase()

const chunkByFive = (items) => {
  const rows = []
  for (let i = 0; i < items.length; i += 5) {
    rows.push(items.slice(i, i + 5))
  }
  return rows
}

const buildGojuonRows = (items) => {
  const mapByReading = new Map()

  items.forEach((item) => {
    const reading = normalizeReading(item.meaning)
    if (!reading || mapByReading.has(reading)) return
    mapByReading.set(reading, item)
  })

  const rows = GOJUON_ROW_LAYOUT.map((row) =>
    row.map((reading) => {
      if (!reading) return null
      return mapByReading.get(reading) || null
    })
  )

  // Fallback to simple chunks if data shape is unexpected from API
  const foundCount = rows.flat().filter(Boolean).length
  if (foundCount < Math.ceil(items.length * 0.6)) {
    return chunkByFive(items)
  }

  return rows
}

function Alphabet({ user }) {
  const [activeTab, setActiveTab] = useState('hiragana')
  const [alphabets, setAlphabets] = useState(DEFAULT_HIRAGANA)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedKanjiLevel, setSelectedKanjiLevel] = useState('n5')
  const [selectedKanjiDetail, setSelectedKanjiDetail] = useState(null)

  const KANJI_RADICAL_BY_CHARACTER = {
    '日': '日 (nhật)', '月': '月 (nguyệt)', '火': '火 (hỏa)', '水': '水 (thủy)', '木': '木 (mộc)',
    '金': '金 (kim)', '土': '土 (thổ)', '一': '一 (nhất)', '二': '二 (nhị)', '三': '一 (nhất)',
    '人': '人 (nhân)', '大': '大 (đại)', '小': '小 (tiểu)', '中': '丨 (cổn)', '本': '木 (mộc)',
    '子': '子 (tử)', '女': '女 (nữ)', '男': '田 (điền)', '学': '子 (tử)', '生': '生 (sinh)',
    '先': '儿 (nhân nhi)', '目': '目 (mục)', '口': '口 (khẩu)', '手': '手 (thủ)', '足': '足 (túc)',
    '心': '心 (tâm)', '耳': '耳 (nhĩ)', '鼻': '鼻 (tỵ)', '歯': '止 (chỉ)', '家': '宀 (miên)',
    '門': '門 (môn)', '窓': '穴 (huyệt)', '床': '广 (nghiễm)', '壁': '土 (thổ)', '天': '大 (đại)',
    '地': '土 (thổ)', '山': '山 (sơn)', '川': '川 (xuyên)', '海': '水 (thủy)', '花': '艹 (thảo)',
    '草': '艹 (thảo)', '鳥': '鳥 (điểu)', '魚': '魚 (ngư)', '虫': '虫 (trùng)', '牛': '牛 (ngưu)',
    '馬': '馬 (mã)', '犬': '犬 (khuyển)', '猫': '犭 (khuyển)', '米': '米 (mễ)',
    '駅': '馬 (mã)', '病': '疒 (nạch)', '院': '阝 (phụ)', '旅': '方 (phương)', '館': '食 (thực)',
    '航': '舟 (chu)', '空': '穴 (huyệt)', '港': '氵 (thủy)', '着': '羊 (dương)', '急': '心 (tâm)',
    '速': '辶 (sước)', '遅': '辶 (sước)', '起': '走 (tẩu)', '寝': '宀 (miên)', '働': '亻 (nhân)',
    '残': '歹 (ngạt)', '業': '木 (mộc)', '練': '糸 (mịch)', '習': '羽 (vũ)', '試': '言 (ngôn)',
    '政': '攵 (phộc)', '経': '糸 (mịch)', '済': '氵 (thủy)', '財': '貝 (bối)', '術': '行 (hành)',
    '科': '禾 (hòa)', '研': '石 (thạch)', '究': '穴 (huyệt)', '境': '土 (thổ)', '環': '玉 (ngọc)',
    '資': '貝 (bối)', '源': '氵 (thủy)', '製': '衣 (y)', '品': '口 (khẩu)', '質': '貝 (bối)',
    '技': '手 (thủ)', '管': '竹 (trúc)', '理': '玉 (ngọc)', '改': '攵 (phộc)', '革': '革 (cách)',
    '議': '言 (ngôn)', '論': '言 (ngôn)', '証': '言 (ngôn)', '拠': '手 (thủ)', '複': '衣 (y)',
    '雑': '隹 (chuy)', '著': '艹 (thảo)', '訳': '言 (ngôn)', '評': '言 (ngôn)', '判': '刂 (đao)',
    '限': '阝 (phụ)', '制': '刂 (đao)', '導': '寸 (thốn)', '監': '皿 (mãnh)', '督': '目 (mục)',
    '維': '糸 (mịch)', '持': '手 (thủ)', '展': '尸 (thi)', '望': '月 (nhục)', '値': '亻 (nhân)',
    '憲': '心 (tâm)', '罰': '网 (võng)', '権': '木 (mộc)', '擁': '手 (thủ)', '護': '言 (ngôn)',
    '厳': '厂 (hán)', '戒': '戈 (qua)', '廉': '广 (nghiễm)', '潔': '氵 (thủy)', '慣': '心 (tâm)',
    '慮': '心 (tâm)', '繊': '糸 (mịch)', '羅': '网 (võng)', '網': '糸 (mịch)', '緻': '糸 (mịch)',
    '密': '宀 (miên)', '衡': '行 (hành)', '閲': '門 (môn)', '覧': '見 (kiến)'
  }

  const KANJI_STROKES_BY_CHARACTER = {
    '日': 4, '月': 4, '火': 4, '水': 4, '木': 4, '金': 8, '土': 3, '一': 1, '二': 2, '三': 3,
    '人': 2, '大': 3, '小': 3, '中': 4, '本': 5, '子': 3, '女': 3, '男': 7, '学': 8, '生': 5,
    '先': 6, '目': 5, '口': 3, '手': 4, '足': 7, '心': 4, '耳': 6, '鼻': 14, '歯': 12, '家': 10,
    '門': 8, '窓': 11, '床': 7, '壁': 16, '天': 4, '地': 6, '山': 3, '川': 3, '海': 9, '花': 7,
    '草': 9, '鳥': 11, '魚': 11, '虫': 6, '牛': 4, '馬': 10, '犬': 4, '猫': 11, '米': 6,
    '駅': 14, '病': 10, '院': 10, '旅': 10, '館': 16, '航': 10, '空': 8, '港': 12, '着': 12, '急': 9,
    '速': 10, '遅': 12, '起': 10, '寝': 13, '働': 13, '残': 10, '業': 13, '練': 14, '習': 11, '試': 13,
    '政': 9, '経': 11, '済': 11, '財': 10, '術': 11, '科': 9, '研': 9, '究': 7, '境': 14, '環': 17,
    '資': 13, '源': 13, '製': 14, '品': 9, '質': 15, '技': 7, '管': 14, '理': 11, '改': 7, '革': 9,
    '議': 20, '論': 15, '証': 12, '拠': 11, '複': 14, '雑': 14, '著': 11, '訳': 11, '評': 12, '判': 7,
    '限': 9, '制': 8, '導': 15, '監': 14, '督': 13, '維': 14, '持': 9, '展': 10, '望': 11, '値': 10,
    '憲': 16, '罰': 14, '権': 15, '擁': 16, '護': 20, '厳': 17, '戒': 7, '廉': 13, '潔': 15, '慣': 14,
    '慮': 15, '繊': 17, '羅': 19, '網': 14, '緻': 16, '密': 11, '衡': 16, '閲': 15, '覧': 17
  }

  const KANJI_READING_BY_CHARACTER = {
    '日': { onyomi: 'ニチ / ジツ', kunyomi: 'ひ / か' },
    '月': { onyomi: 'ゲツ / ガツ', kunyomi: 'つき' },
    '火': { onyomi: 'カ', kunyomi: 'ひ' },
    '水': { onyomi: 'スイ', kunyomi: 'みず' },
    '木': { onyomi: 'モク / ボク', kunyomi: 'き' },
    '金': { onyomi: 'キン / コン', kunyomi: 'かね' },
    '土': { onyomi: 'ド / ト', kunyomi: 'つち' },
    '人': { onyomi: 'ジン / ニン', kunyomi: 'ひと' },
    '学': { onyomi: 'ガク', kunyomi: 'まな.ぶ' },
    '生': { onyomi: 'セイ / ショウ', kunyomi: 'い.きる / う.まれる' }
  }

  const KANJI_COMPONENTS_BY_CHARACTER = {
    '済': '氵 (thủy) + 斉 (tề)',
    '海': '氵 (thủy) + 每',
    '駅': '馬 (mã) + 尺',
    '議': '言 (ngôn) + 義',
    '護': '言 (ngôn) + 蒦',
    '権': '木 (mộc) + 雚',
    '働': '亻 (nhân đứng) + 動',
    '資': '次 + 貝 (bối)',
    '複': '衤 (y) + 復',
    '慣': '忄 (tâm đứng) + 貫',
    '導': '道 + 寸 (thốn)',
    '環': '王 (ngọc) + 睘',
    '観': '見 + 雚',
    '読': '言 (ngôn) + 売',
    '証': '言 (ngôn) + 正',
    '製': '制 + 衣 (y)',
    '練': '糸 (mịch) + 東',
    '羅': '网 (võng) + 維 phần dưới',
    '網': '糸 (mịch) + 罔',
    '覧': '臣 + 見 (kiến)'
  }

  const toKanjiDetail = (item) => {
    const radical = KANJI_RADICAL_BY_CHARACTER[item.character] || 'Đang cập nhật'
    const strokes = KANJI_STROKES_BY_CHARACTER[item.character] || 'Đang cập nhật'
    const meaning = KANJI_MEANING_VI[item.meaning] || item.meaning || 'Không có'
    const reading = KANJI_READING_BY_CHARACTER[item.character] || { onyomi: 'Đang cập nhật', kunyomi: 'Đang cập nhật' }
    const level = item.level?.toString().toUpperCase() || ''
    const components = KANJI_COMPONENTS_BY_CHARACTER[item.character]
      || `${radical} + phần còn lại của chữ (thường giữ vai trò ngữ âm hoặc bổ sung nghĩa)`

    return {
      character: item.character,
      level,
      meaning,
      radical,
      components,
      strokes,
      onyomi: reading.onyomi,
      kunyomi: reading.kunyomi,
      writeGuide: [
        'Viết theo nguyên tắc từ trên xuống dưới.',
        'Ưu tiên nét từ trái sang phải khi có thể.',
        'Nét bao ngoài thường viết trước phần bên trong.',
        'Kết thúc bằng nét đóng hoặc nét chốt để chữ cân đối.'
      ],
      explanation: `Chữ ${item.character} (cấp ${level}) mang nghĩa "${meaning}". Bộ thủ chính là ${radical}, tổng số nét khoảng ${strokes}. Lưu ý: mỗi Kanji chỉ có một bộ thủ chính để tra từ điển, nhưng có thể gồm nhiều thành phần cấu tạo khác nhau.`
    }
  }

  useEffect(() => {
    if (activeTab === 'hiragana') {
      setAlphabets(DEFAULT_HIRAGANA)
      return
    }

    if (activeTab === 'katakana') {
      setAlphabets(DEFAULT_KATAKANA)
      return
    }

    setAlphabets(DEFAULT_KANJI_BY_LEVEL[selectedKanjiLevel] || DEFAULT_KANJI_N5)
  }, [activeTab, selectedKanjiLevel])

  useEffect(() => {
    setSelectedKanjiDetail(null)
  }, [activeTab, selectedKanjiLevel])

  useEffect(() => {
    // All tabs use grid view for consistent display
    setViewMode('grid')
  }, [activeTab])

  const renderTableView = () => {
    const getDisplayType = (item) => {
      if (item.type === 'Kanji') return 'Hán tự'
      if (item.type === 'Hiragana') return 'Hiragana'
      if (item.type === 'Katakana') return 'Katakana'
      return item.type
    }

    const getDisplayMeaning = (item) => {
      if (item.type === 'Kanji') {
        return KANJI_MEANING_VI[item.meaning] || item.meaning || 'Không có'
      }
      return item.meaning || 'Không có'
    }

    const getDisplayLevel = (item) => {
      if (!item.level) return ''
      return item.type === 'Kanji' ? item.level.toString().toUpperCase() : item.level
    }

    // Display all alphabets in a grid layout (5 columns)
    return (
      <div className="alphabet-grid-table">
        {alphabets.map((item) => (
          <div key={item.alphabetId} className="grid-cell">
            <div className="cell-character">{item.character}</div>
            <div className="cell-meaning">{getDisplayMeaning(item)}</div>
            <div className="cell-type">{getDisplayType(item)}</div>
            {item.level && <div className="cell-level">Cấp độ {getDisplayLevel(item)}</div>}
          </div>
        ))}
      </div>
    )
  }

  const renderGridView = () => {
    const getDisplayType = (item) => {
      if (item.type === 'Kanji') return 'Hán tự'
      if (item.type === 'Hiragana') return 'Hiragana'
      if (item.type === 'Katakana') return 'Katakana'
      return item.type
    }

    const getDisplayMeaning = (item) => {
      if (item.type === 'Kanji') {
        return KANJI_MEANING_VI[item.meaning] || item.meaning || 'Không có'
      }
      return item.meaning || 'Không có'
    }

    const getDisplayLevel = (item) => {
      if (!item.level) return ''
      return item.type === 'Kanji' ? item.level.toString().toUpperCase() : item.level
    }

    const shouldUseTraditionalLayout = activeTab === 'hiragana' || activeTab === 'katakana'
    const rows = shouldUseTraditionalLayout ? buildGojuonRows(alphabets) : chunkByFive(alphabets)

    return (
      <div className="alphabet-grid-rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="alphabet-row">
            {row.map((item, colIndex) => (
              item ? (
                <div key={item.alphabetId} className="character-card">
                  <div className="character-display">
                    <span className="character-text">{item.character}</span>
                  </div>
                  <div className="character-info">
                    <p className="character-type">{getDisplayType(item)}</p>
                    <p className="character-meaning">{getDisplayMeaning(item)}</p>
                    {item.level && <p className="character-level">Cấp độ {getDisplayLevel(item)}</p>}
                    {item.type === 'Kanji' && (
                      <button
                        className="kanji-detail-btn"
                        onClick={() => setSelectedKanjiDetail(toKanjiDetail(item))}
                      >
                        Xem cách viết & phân tích
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div key={`empty-${rowIndex}-${colIndex}`} className="character-card character-card-empty" aria-hidden="true" />
              )
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="alphabet-container">
      <div className="alphabet-header">
        <h1 className="alphabet-title">Chữ Cái</h1>
        <p className="alphabet-subtitle">Học các ký tự tiếng Nhật</p>
      </div>

      <div className="alphabet-tabs">
        <button
          className={`alphabet-tab ${activeTab === 'hiragana' ? 'active' : ''}`}
          onClick={() => setActiveTab('hiragana')}
        >
          ひらがな (Bảng Hiragana)
        </button>
        <button
          className={`alphabet-tab ${activeTab === 'katakana' ? 'active' : ''}`}
          onClick={() => setActiveTab('katakana')}
        >
          カタカナ (Bảng Katakana)
        </button>
        <button
          className={`alphabet-tab ${activeTab === 'kanji' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanji')}
        >
          漢字 (Hán tự)
        </button>
      </div>

      {activeTab === 'kanji' && (
        <div className="kanji-level-selector">
          <select
            value={selectedKanjiLevel}
            onChange={(e) => setSelectedKanjiLevel(e.target.value)}
            className="level-select"
          >
            <option value="n5">N5 (Sơ cấp)</option>
            <option value="n4">N4 (Sơ trung cấp)</option>
            <option value="n3">N3 (Trung cấp)</option>
            <option value="n2">N2 (Trung cao cấp)</option>
            <option value="n1">N1 (Cao cấp)</option>
          </select>
        </div>
      )}

      {alphabets.length > 0 ? (
        viewMode === 'table' ? renderTableView() : renderGridView()
      ) : (
        <div className="alphabet-empty">Không có dữ liệu</div>
      )}

      {selectedKanjiDetail && (
        <div className="kanji-modal-overlay" onClick={() => setSelectedKanjiDetail(null)}>
          <div className="kanji-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="kanji-modal-close"
              onClick={() => setSelectedKanjiDetail(null)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="kanji-modal-header">
              <div className="kanji-modal-character">{selectedKanjiDetail.character}</div>
              <div>
                <h3>Chi tiết Kanji {selectedKanjiDetail.level}</h3>
                <p>{selectedKanjiDetail.meaning}</p>
              </div>
            </div>

            <div className="kanji-modal-grid">
              <div className="kanji-detail-item">
                <strong>Bộ thủ chính</strong>
                <span>{selectedKanjiDetail.radical}</span>
                <small className="kanji-radical-note">Mỗi Kanji chỉ có 1 bộ thủ chính để phân loại.</small>
              </div>
              <div className="kanji-detail-item">
                <strong>Số nét</strong>
                <span>{selectedKanjiDetail.strokes}</span>
              </div>
              <div className="kanji-detail-item">
                <strong>Âm On</strong>
                <span>{selectedKanjiDetail.onyomi}</span>
              </div>
              <div className="kanji-detail-item">
                <strong>Âm Kun</strong>
                <span>{selectedKanjiDetail.kunyomi}</span>
              </div>
            </div>

            <div className="kanji-explanation">
              <h4>Thành phần cấu tạo</h4>
              <p>{selectedKanjiDetail.components}</p>
            </div>

            <div className="kanji-write-guide">
              <h4>Cách viết chữ Kanji</h4>
              <ol>
                {selectedKanjiDetail.writeGuide.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="kanji-explanation">
              <h4>Giải thích chữ Kanji</h4>
              <p>{selectedKanjiDetail.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Alphabet
