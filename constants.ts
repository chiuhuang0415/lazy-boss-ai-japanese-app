import { KanaChar, KanaCategory } from './types';

const SEION: KanaChar[] = [
  { romaji: 'a', hiragana: 'あ', katakana: 'ア', category: KanaCategory.SEION },
  { romaji: 'i', hiragana: 'い', katakana: 'イ', category: KanaCategory.SEION },
  { romaji: 'u', hiragana: 'う', katakana: 'ウ', category: KanaCategory.SEION },
  { romaji: 'e', hiragana: 'え', katakana: 'エ', category: KanaCategory.SEION },
  { romaji: 'o', hiragana: 'お', katakana: 'オ', category: KanaCategory.SEION },

  { romaji: 'ka', hiragana: 'か', katakana: 'カ', category: KanaCategory.SEION },
  { romaji: 'ki', hiragana: 'き', katakana: 'キ', category: KanaCategory.SEION },
  { romaji: 'ku', hiragana: 'く', katakana: 'ク', category: KanaCategory.SEION },
  { romaji: 'ke', hiragana: 'け', katakana: 'ケ', category: KanaCategory.SEION },
  { romaji: 'ko', hiragana: 'こ', katakana: 'コ', category: KanaCategory.SEION },

  { romaji: 'sa', hiragana: 'さ', katakana: 'サ', category: KanaCategory.SEION },
  { romaji: 'shi', hiragana: 'し', katakana: 'シ', category: KanaCategory.SEION },
  { romaji: 'su', hiragana: 'す', katakana: 'ス', category: KanaCategory.SEION },
  { romaji: 'se', hiragana: 'せ', katakana: 'セ', category: KanaCategory.SEION },
  { romaji: 'so', hiragana: 'そ', katakana: 'ソ', category: KanaCategory.SEION },

  { romaji: 'ta', hiragana: 'た', katakana: 'タ', category: KanaCategory.SEION },
  { romaji: 'chi', hiragana: 'ち', katakana: 'チ', category: KanaCategory.SEION },
  { romaji: 'tsu', hiragana: 'つ', katakana: 'ツ', category: KanaCategory.SEION },
  { romaji: 'te', hiragana: 'て', katakana: 'テ', category: KanaCategory.SEION },
  { romaji: 'to', hiragana: 'と', katakana: 'ト', category: KanaCategory.SEION },

  { romaji: 'na', hiragana: 'な', katakana: 'ナ', category: KanaCategory.SEION },
  { romaji: 'ni', hiragana: 'に', katakana: 'ニ', category: KanaCategory.SEION },
  { romaji: 'nu', hiragana: 'ぬ', katakana: 'ヌ', category: KanaCategory.SEION },
  { romaji: 'ne', hiragana: 'ね', katakana: 'ネ', category: KanaCategory.SEION },
  { romaji: 'no', hiragana: 'の', katakana: 'ノ', category: KanaCategory.SEION },

  { romaji: 'ha', hiragana: 'は', katakana: 'ハ', category: KanaCategory.SEION },
  { romaji: 'hi', hiragana: 'ひ', katakana: 'ヒ', category: KanaCategory.SEION },
  { romaji: 'fu', hiragana: 'ふ', katakana: 'フ', category: KanaCategory.SEION },
  { romaji: 'he', hiragana: 'へ', katakana: 'ヘ', category: KanaCategory.SEION },
  { romaji: 'ho', hiragana: 'ほ', katakana: 'ホ', category: KanaCategory.SEION },

  { romaji: 'ma', hiragana: 'ま', katakana: 'マ', category: KanaCategory.SEION },
  { romaji: 'mi', hiragana: 'み', katakana: 'ミ', category: KanaCategory.SEION },
  { romaji: 'mu', hiragana: 'む', katakana: 'ム', category: KanaCategory.SEION },
  { romaji: 'me', hiragana: 'め', katakana: 'メ', category: KanaCategory.SEION },
  { romaji: 'mo', hiragana: 'も', katakana: 'モ', category: KanaCategory.SEION },

  { romaji: 'ya', hiragana: 'や', katakana: 'ヤ', category: KanaCategory.SEION },
  { romaji: 'yu', hiragana: 'ゆ', katakana: 'ユ', category: KanaCategory.SEION },
  { romaji: 'yo', hiragana: 'よ', katakana: 'ヨ', category: KanaCategory.SEION },

  { romaji: 'ra', hiragana: 'ら', katakana: 'ラ', category: KanaCategory.SEION },
  { romaji: 'ri', hiragana: 'り', katakana: 'リ', category: KanaCategory.SEION },
  { romaji: 'ru', hiragana: 'る', katakana: 'ル', category: KanaCategory.SEION },
  { romaji: 're', hiragana: 'れ', katakana: 'レ', category: KanaCategory.SEION },
  { romaji: 'ro', hiragana: 'ろ', katakana: 'ロ', category: KanaCategory.SEION },

  { romaji: 'wa', hiragana: 'わ', katakana: 'ワ', category: KanaCategory.SEION },
  { romaji: 'wo', hiragana: 'を', katakana: 'ヲ', category: KanaCategory.SEION },
  { romaji: 'n', hiragana: 'ん', katakana: 'ン', category: KanaCategory.SEION },
];

const DAKUON: KanaChar[] = [
  // G
  { romaji: 'ga', hiragana: 'が', katakana: 'ガ', category: KanaCategory.DAKUON },
  { romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ', category: KanaCategory.DAKUON },
  { romaji: 'gu', hiragana: 'ぐ', katakana: 'グ', category: KanaCategory.DAKUON },
  { romaji: 'ge', hiragana: 'げ', katakana: 'ゲ', category: KanaCategory.DAKUON },
  { romaji: 'go', hiragana: 'ご', katakana: 'ゴ', category: KanaCategory.DAKUON },
  // Z
  { romaji: 'za', hiragana: 'ざ', katakana: 'ザ', category: KanaCategory.DAKUON },
  { romaji: 'ji', hiragana: 'じ', katakana: 'ジ', category: KanaCategory.DAKUON },
  { romaji: 'zu', hiragana: 'ず', katakana: 'ズ', category: KanaCategory.DAKUON },
  { romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ', category: KanaCategory.DAKUON },
  { romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ', category: KanaCategory.DAKUON },
  // D
  { romaji: 'da', hiragana: 'だ', katakana: 'ダ', category: KanaCategory.DAKUON },
  { romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ', category: KanaCategory.DAKUON }, // ji (di)
  { romaji: 'zu', hiragana: 'づ', katakana: 'ヅ', category: KanaCategory.DAKUON }, // zu (du)
  { romaji: 'de', hiragana: 'で', katakana: 'デ', category: KanaCategory.DAKUON },
  { romaji: 'do', hiragana: 'ど', katakana: 'ド', category: KanaCategory.DAKUON },
  // B
  { romaji: 'ba', hiragana: 'ば', katakana: 'バ', category: KanaCategory.DAKUON },
  { romaji: 'bi', hiragana: 'び', katakana: 'ビ', category: KanaCategory.DAKUON },
  { romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ', category: KanaCategory.DAKUON },
  { romaji: 'be', hiragana: 'べ', katakana: 'ベ', category: KanaCategory.DAKUON },
  { romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ', category: KanaCategory.DAKUON },
  // P (Handakuon)
  { romaji: 'pa', hiragana: 'ぱ', katakana: 'パ', category: KanaCategory.DAKUON },
  { romaji: 'pi', hiragana: 'ぴ', katakana: 'ピ', category: KanaCategory.DAKUON },
  { romaji: 'pu', hiragana: 'ぷ', katakana: 'プ', category: KanaCategory.DAKUON },
  { romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ', category: KanaCategory.DAKUON },
  { romaji: 'po', hiragana: 'ぽ', katakana: 'ポ', category: KanaCategory.DAKUON },
];

const YOON: KanaChar[] = [
  // K
  { romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ', category: KanaCategory.YOON },
  { romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ', category: KanaCategory.YOON },
  { romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ', category: KanaCategory.YOON },
  // S
  { romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ', category: KanaCategory.YOON },
  { romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ', category: KanaCategory.YOON },
  { romaji: 'sho', hiragana: 'しょ', katakana: 'ショ', category: KanaCategory.YOON },
  // C
  { romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ', category: KanaCategory.YOON },
  { romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ', category: KanaCategory.YOON },
  { romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ', category: KanaCategory.YOON },
  // N
  { romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ', category: KanaCategory.YOON },
  { romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', category: KanaCategory.YOON },
  { romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ', category: KanaCategory.YOON },
  // H
  { romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', category: KanaCategory.YOON },
  { romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', category: KanaCategory.YOON },
  { romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', category: KanaCategory.YOON },
  // M
  { romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ', category: KanaCategory.YOON },
  { romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ', category: KanaCategory.YOON },
  { romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ', category: KanaCategory.YOON },
  // R
  { romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ', category: KanaCategory.YOON },
  { romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ', category: KanaCategory.YOON },
  { romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ', category: KanaCategory.YOON },
  // G
  { romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', category: KanaCategory.YOON },
  { romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', category: KanaCategory.YOON },
  { romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', category: KanaCategory.YOON },
  // J
  { romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ', category: KanaCategory.YOON },
  { romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ', category: KanaCategory.YOON },
  { romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ', category: KanaCategory.YOON },
  // B
  { romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ', category: KanaCategory.YOON },
  { romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ', category: KanaCategory.YOON },
  { romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ', category: KanaCategory.YOON },
  // P
  { romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', category: KanaCategory.YOON },
  { romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', category: KanaCategory.YOON },
  { romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', category: KanaCategory.YOON },
];

export const KANA_DATA: KanaChar[] = [...SEION, ...DAKUON, ...YOON];
