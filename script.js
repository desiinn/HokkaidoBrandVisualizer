const REPO_NAME = "HokkaidoBrandVisualizer";
// --- キーワードリスト（自由に追加可能） ---
const keywordsList = [
    { key: "luxury", name: "高級感" },
    { key: "simple", name: "シンプル" },
    { key: "modern", name: "モダン" },
    { key: "natural", name: "ナチュラル" },
    { key: "rustic", name: "素朴" },
    { key: "clean", name: "クリーン" },
    { key: "clear", name: "透明感" },
    { key: "unique", name: "ユニーク" },
    { key: "pop", name: "ポップ" },
    { key: "japanese", name: "和風" },
    { key: "retro", name: "レトロ" },
    // ...追加可能
];
// キーワードごとのプロンプト例
const keywordPrompts = {
    luxury: "high-end luxury, premium feel, spremium materials, harmonious design",
    simple: "clean simple aesthetic, intuitive layout, effortless and accessible design, clear and easy to understand",
    modern: "sleek modern design, cutting-edge typography, contemporary forms",
    natural: "natural organic ingredients concept, subtle hand-rendered graphic texture, muted earthy tones, serene atmosphere",
    rustic: "rustic handcrafted texture, cozy and inviting feel, vintage illustration style, traditional and sincere design",
    clean: "pristine clean aesthetic, delicate graphic, clear and crisp visual elements",
    clear: "crystal clear appearance, transparent and icy texture, light and delicate design, fresh and refreshing atmosphere",
    unique: "Distinct unique concept, visually compelling arrangement, artistic composition, bold expressive style",
    pop: "Bold, dynamic graphic style, high contrast and saturation, vibrant playful aesthetic, energetic visual elements",
    japanese: " Japanese-inspired graphic, elegant simplicity, delicate brushwork, tranquil atmosphere, intricate yet subtle design",
    retro: "Futuristic design, sleek and sophisticated, minimalist yet luxurious, dynamic coNostalgic, vintage package design, inspired by 1950s or 1980s graphics, using faded colors and period typography.mposition, innovative design concept",
};

// --- 色調キーワード（カラー選択からキーワード選択へ変更） ---
const toneOptions = [
    { key: "tone-pale", name: "ペールトーン", gradientColors: ['#FADADD', '#FFFACD', '#C8F9E4', '#E5E3F5'], prompt: "pale tone, high lightness and low saturation color palette, delicate and soft, ethereal and transparent tints" },
    { key: "tone-vivid", name: "ビビッド", gradientColors: ['#FF00FF', '#FFFF00', '#00FFFF', '#FF0000'], prompt: "vivid saturated colors, bright and energetic" },
    { key: "tone-nuance", name: "ニュアンスカラー", gradientColors: ['#A9A9A9', '#B0C4DE', '#B5878F'], prompt: "nuanced desaturated colors, subtle and sophisticated" },
    { key: "tone-dark", name: "ダークトーン", gradientColors:['#653030', '#4B5320', '#191970', '#000000'], prompt: "dark tone, deep rich colors, moody" },
    { key: "tone-monotone", name: "モノトーン", gradientColors: ['#000000', '#808080', '#D3D3D3', '#FFFFFF'], prompt: "monotone palette, grayscale accents, minimal contrast" },
    { key: "tone-warm", name: "ウォーム", gradientColors: ['#FFB347', '#FF7F50', '#FF4500'], prompt: "warm tone, cozy and inviting colors, comforting and friendly" },
    { key: "tone-cool", name: "クール", gradientColors: ['#87CEEB', '#4682B4', '#5F9EA0'], prompt: "cool tone, refreshing and calm colors, modern and sleek" },
    // ...追加可能
];

// --- 北海道モチーフオプション ---
const motifOptions = {
    bear: {name: "ヒグマ", basePrompt: "Hokkaido brown bear motif graphic, bold and powerful illustration, wilderness element"},
    fox: {name: "キタキツネ", basePrompt: "cute Ezo red fox illustration, playful and curious character, snowy winter setting"},
    simaenaga: {name: "シマエナガ", basePrompt: "cute Long-tailed tit bird graphic, fluffy white feather texture, round and tiny figure, snowy winter forest setting"},
    cow: {name: "牛", basePrompt: "detailed Holstein dairy cow illustration, peaceful and plump animal character, vast green pasture background"},
    lavender: {name: "ラベンダー", basePrompt: "delicate lavender flower illustration, rich herb graphic, vibrant and colorful bloom, subtle texture"},
    birch: {name: "白樺", basePrompt: "elegant white birch tree forest motif, tall slender trunk pattern, refreshing light green leaves illustration, cool and serene atmosphere"},
    farm: {name: "牧場", basePrompt: "wide open pasture landscape illustration, wooden fence and silo motif, vast and peaceful atmosphere"},
    plain: {name: "大地", basePrompt: "vast green plain landscape illustration, endless horizon and open sky, serene and peaceful atmosphere, earthy and natural texture"},
    sea: {name: "海", basePrompt: "deep ocean wave pattern, abstract marine texture, vast and powerful blue color gradient, sparkling water surface"},
    driftice: {name: "流氷", basePrompt: "cold and majestic drift ice pattern, geometric ice block texture, abstract winter landscape"}, 
    snow: {name: "雪", basePrompt: "minimalist snow crystal graphic, icy clear texture, cool and crisp atmosphere, pure white"},
    milk: {name: "牛乳", basePrompt: "fresh milk carton or bottle graphic, creamy white liquid texture, simple and healthy food element, bright blue and white color"},
    potato: {name: "ジャガイモ", basePrompt: "round and earthy potato vegetable motif, rough skin texture, natural harvest illustration, brown and yellow tones"},
    melon: {name: "メロン", basePrompt: "sliced luxury cantaloupe fruit graphic, vibrant orange flesh texture, sweet and juicy element, rich green and orange color"},
    salmon: {name: "鮭", basePrompt: "vibrant salmon fish pattern, rich river life motif, detailed scales texture"},
};

// 画像ファイル名リスト
const pictImages = [
"botanical_clean_modern_tone-pale_bottle.jpeg",
// ...追加可能
];

// 画像データ
const availableImages = pictImages.map(filename => {
    const tags = filename.replace(/\.[^/.]+$/, "").split("_");
    return {
        // 修正後のパス: images/pict/ファイル名
        src: `images/pict/${filename}`, // 👈 リポジトリ名（REPO_NAME）を外す
        tags: tags
    };
});

// --- 状態変数 ---
let selectedKeywords = [];
let selectedColorTone = "";
let selectedMotifs = []; // 複数選択対応に変更
let selectedMotif = ""; // 旧互換（残さなくても可）

// --- DOM要素 ---
let keywordsContainer;
let colorContainer;
let motifOptionsContainer;
let showPromptBtn;
let copyPromptBtn;
let resetBtn;
let copyMessage;
let promptDisplay;
let generatedPrompt;
let selectionSummary;
let imageDisplayArea;
let dynamicImageGrid;
let customColorToneInput; 
let customMotifInput; // 追加

// --- 初期化 ---
function initializeElements() {
    keywordsContainer = document.getElementById("keywords-container");
    colorContainer = document.getElementById("color-tones"); 
    motifOptionsContainer = document.getElementById("motif-options");
    showPromptBtn = document.getElementById("show-prompt-btn");
    copyPromptBtn = document.getElementById("copy-prompt-btn");
    resetBtn = document.getElementById("reset-btn");
    copyMessage = document.getElementById("copy-message");
    promptDisplay = document.getElementById("prompt-display");
    generatedPrompt = document.getElementById("generated-prompt");
    selectionSummary = document.getElementById("selection-summary");
    imageDisplayArea = document.getElementById("image-display-area");
    dynamicImageGrid = document.getElementById("dynamic-image-grid");
    customColorToneInput = document.getElementById("custom-color-tone");
    customMotifInput = document.getElementById("custom-motif");
}

// --- キーワードボタン生成 ---
function renderKeywords() {
    keywordsContainer.innerHTML = "";
    const row = document.createElement("div");
    row.className = "flex flex-wrap gap-3"; 

    keywordsList.forEach(keyword => {
        const isSelected = selectedKeywords.includes(keyword.key);
        const button = document.createElement("button");

        button.className = `keyword-btn p-3 rounded-lg border-2 transition-all duration-200 flex justify-center items-center ${
            isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
        }`;

        // ボタンのテキスト要素を作成
        const textDiv = document.createElement("div");
        textDiv.className = "text-center text-base";
        textDiv.textContent = keyword.name;

        // 要素を組み立て
        button.appendChild(textDiv);

        button.onclick = () => {
            if (isSelected) {
                selectedKeywords = selectedKeywords.filter(k => k !== keyword.key);
            } else {
                selectedKeywords.push(keyword.key);
            }
            updateUI();
        };
        row.appendChild(button);
    });
    keywordsContainer.appendChild(row);
}

// --- 色調ボタン生成 ---
function renderColorTones() {
    colorContainer.innerHTML = "";

    const row = document.createElement("div");
    row.className = "flex flex-wrap gap-3 items-center";

    toneOptions.forEach(tone => {
        const isSelected = selectedColorTone === tone.key;
        const button = document.createElement("button");

        button.className = `tone-btn p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 w-32 ${
            isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
        }`;
        button.title = tone.name; // ツールチップ

        // グラデーションアイコン要素を作成
        const gradientIcon = document.createElement("div");
        gradientIcon.className = "w-full h-10 rounded";
        if (tone.gradientColors && tone.gradientColors.length >= 2) {
            const colors = tone.gradientColors.join(', ');
            gradientIcon.style.background = `linear-gradient(to right, ${colors})`;
        }

        // ボタンのテキスト要素を作成
        const textSpan = document.createElement("span");
        textSpan.textContent = tone.name;

        // 要素を組み立て
        button.appendChild(gradientIcon);
        button.appendChild(textSpan);

        button.onclick = () => {
            selectedColorTone = isSelected ? "" : tone.key; 
            updateUI();
        };
        row.appendChild(button);
    });

    colorContainer.appendChild(row);
}


// --- モチーフボタン生成（複数選択対応） ---
function renderMotifOptions() {
    motifOptionsContainer.innerHTML = "";
    const row = document.createElement("div");
    row.className = "flex flex-wrap gap-3";

    Object.keys(motifOptions).forEach(key => {
        const type = motifOptions[key];
        const isSelected = selectedMotifs.includes(key);
        const button = document.createElement("button");

        button.className = `motif-btn p-3 rounded-lg border-2 transition-all duration-200 flex justify-center items-center ${
            isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
        }`;
        
        const textDiv = document.createElement("div");
        textDiv.className = "text-center text-base";
        textDiv.textContent = type.name;

        button.appendChild(textDiv);

        button.onclick = () => {
            if (isSelected) {
                selectedMotifs = selectedMotifs.filter(m => m !== key);
            } else {
                selectedMotifs.push(key);
            }
            updateUI();
        };
        row.appendChild(button);
    });

// カスタムモチーフ入力がある場合はその表示（空文字は表示しない）
    if (customMotifInput && customMotifInput.value && customMotifInput.value.trim()) {
        const wrapper = document.createElement("div");
        wrapper.className = "flex items-center gap-2";

        // カスタム値表示（簡易）
        const note = document.createElement("div");
        note.className = "text-sm text-gray-600";
        note.textContent = "カスタムモチーフ:";
        wrapper.appendChild(note);

        const display = document.createElement("div");
        display.className = "text-sm text-gray-800";
        display.textContent = customMotifInput.value.trim();
        wrapper.appendChild(display);

        row.appendChild(wrapper);

    }
    motifOptionsContainer.appendChild(row);
}

// --- 画像フィルタ（AND条件：キーワード・色調・モチーフ） ---
function updateFilteredImages() {
    dynamicImageGrid.innerHTML = "";
    // フィルター条件（selectedMotifs を配列として展開）
    const filters = [
        ...selectedKeywords,
        selectedColorTone,
        ...selectedMotifs
    ].filter(Boolean);

    // 何も選択されていない場合は画像を表示しない
    if (filters.length === 0) {
        imageDisplayArea.classList.add("hidden");
        return;
    }

    // 色調のみ選択されている場合の処理
    if (selectedColorTone && filters.length === 1) {
        const matchingImages = availableImages.filter(image => image.tags.includes(selectedColorTone));
        if (matchingImages.length > 0) {
            matchingImages.forEach(image => {
                const imageEl = document.createElement("img");
                imageEl.src = image.src;
                imageEl.alt = "選択されたモチーフ";
                imageEl.className = "w-full h-full object-contain rounded-lg border border-gray-300 cursor-pointer transition hover:scale-105";
                imageEl.style.maxWidth = "200px";
                imageEl.style.maxHeight = "200px";
                imageEl.onclick = () => openImageModal(image.src);
                const wrapper = document.createElement("div");
                wrapper.className = "flex justify-center items-center";
                wrapper.appendChild(imageEl);
                dynamicImageGrid.appendChild(wrapper);
            });
        } else {
            dynamicImageGrid.innerHTML = '<div class="text-gray-500 text-center py-8 col-span-4">該当する画像がありません</div>';
        }
        imageDisplayArea.classList.remove("hidden");
        return;
    }

    // AND条件で全タグ一致
    const matchingImages = availableImages.filter(image => {
        return filters.every(filter => image.tags.includes(filter));
    });

    imageDisplayArea.classList.remove("hidden");
    if (matchingImages.length > 0) {
        matchingImages.forEach(image => {
            const imageEl = document.createElement("img");
            imageEl.src = image.src;
            imageEl.alt = "選択されたモチーフ";
            imageEl.className = "w-full h-full object-contain rounded-lg border border-gray-300 cursor-pointer transition hover:scale-105";
            imageEl.style.maxWidth = "200px";
            imageEl.style.maxHeight = "200px";
            imageEl.onclick = () => openImageModal(image.src);
            const wrapper = document.createElement("div");
            wrapper.className = "flex justify-center items-center";
            wrapper.appendChild(imageEl);
            dynamicImageGrid.appendChild(wrapper);
        });
    } else {
        dynamicImageGrid.innerHTML = '<div class="text-gray-500 text-center py-8 col-span-4">該当する画像がありません</div>';
    }
}

// --- 画像プレビューモーダル ---
function openImageModal(src) {
    const overlay = document.getElementById('image-modal-overlay');
    const modalImg = document.getElementById('image-modal-img');
    if (overlay && modalImg) {
        modalImg.src = src;
        overlay.classList.remove('hidden');
    }
}
function closeImageModal() {
    const overlay = document.getElementById('image-modal-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// --- プロンプト生成 ---
function generatePrompt() {
    let prompt = "Create a Hokkaido image graphic concept, ";

    // キーワード
    if (selectedKeywords.length > 0) {
        const keywordTexts = selectedKeywords.map(k => keywordPrompts[k]).filter(Boolean);
        if (keywordTexts.length > 0) {
            prompt += keywordTexts.join(", ") + ", ";
        }
    }

    // 色調（単一選択）
    if (selectedColorTone) {
        const found = toneOptions.find(opt => opt.key === selectedColorTone);
        if (found && found.prompt) {
            prompt += found.prompt + ", ";
        }
    }

    // その他色調（テキスト入力）
    const customColor = customColorToneInput?.value?.trim();
    if (customColor) {
        prompt += `main color: ${customColor}, `;
    }

    // モチーフ（複数選択 + カスタム）
    const motifPrompts = selectedMotifs.map(m => motifOptions[m]?.basePrompt).filter(Boolean);
    if (motifPrompts.length > 0) {
        prompt += motifPrompts.join(", ") + ", ";
    }
    const customMotif = customMotifInput?.value?.trim();
    if (customMotif) {
        prompt += `${customMotif}, `;
    }

    prompt += "brand logo text 'Sample' clearly visible on the graphic, soft diffused lighting, high quality, 4K resolution,";
    return prompt;
}


// --- UI更新 ---
function updateUI() {
    renderKeywords();
    renderColorTones();
    renderMotifOptions();
    updateFilteredImages();
    const hasSelection = selectedKeywords.length > 0 || selectedMotifs.length > 0 || selectedColorTone || (customColorToneInput?.value?.trim()) || (customMotifInput?.value?.trim());
    showPromptBtn.disabled = !hasSelection;
    copyPromptBtn.disabled = !hasSelection;
    promptDisplay.classList.add("hidden");
    if (window.lucide) {
        lucide.createIcons();
    }
}

// --- プロンプト表示（要約部分の色調表示も toneOptions に合わせて修正） ---
function showPrompt() {
    const hasSelection = selectedKeywords.length > 0 || selectedMotifs.length > 0 || selectedColorTone || (customColorToneInput?.value?.trim()) || (customMotifInput?.value?.trim());
    if (!hasSelection) return;
    const prompt = generatePrompt();
    generatedPrompt.textContent = prompt;
    let summaryHTML = "";
    if (selectedKeywords.length > 0) {
        const keywordTexts = selectedKeywords.map(k => {
            const found = keywordsList.find(item => item.key === k);
            return found ? found.name : k;
        });
        summaryHTML += `<div><strong>キーワード:</strong> ${keywordTexts.join(", ")}</div>`;
    }
    if (selectedColorTone) {
        const found = toneOptions.find(opt => opt.key === selectedColorTone);
        if (found) summaryHTML += `<div><strong>色調:</strong> ${found.name}</div>`;
    }
    if (selectedMotifs.length > 0) {
        const motifNames = selectedMotifs.map(m => motifOptions[m]?.name || m);
        summaryHTML += `<div><strong>モチーフ:</strong> ${motifNames.join(", ")}</div>`;
    }
    const customMotif = customMotifInput?.value?.trim();
    if (customMotif) {
        summaryHTML += `<div><strong>カスタムモチーフ:</strong> ${customMotif}</div>`;
    }
    selectionSummary.innerHTML = summaryHTML;
    promptDisplay.classList.remove("hidden");
    promptDisplay.classList.add("fade-in");
}


// --- クリップボードコピー ---
async function copyToClipboard() {
    const prompt = generatePrompt();
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(prompt);
            showCopyMessage("プロンプトをコピーしました！");
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyMessage("プロンプトをコピーしました！");
        }
    } catch (err) {
        showCopyMessage("コピーに失敗しました");
    }
}

function showCopyMessage(message) {
    copyMessage.textContent = message;
    copyMessage.classList.remove("hidden");
    setTimeout(() => {
        copyMessage.classList.add("hidden");
    }, 3000);
}

// --- リセット ---
function reset() {
    selectedKeywords = [];
    selectedColorTone = "";
    selectedMotifs = [];
    promptDisplay.classList.add("hidden");
    copyMessage.classList.add("hidden");
    if (customColorToneInput) customColorToneInput.value = "";
    if (customMotifInput) customMotifInput.value = "";
    updateUI();
}


// --- イベントリスナー ---
function setupEventListeners() {
    showPromptBtn.addEventListener("click", showPrompt);
    copyPromptBtn.addEventListener("click", copyToClipboard);
    resetBtn.addEventListener("click", reset);
}

// --- ページ初期化 ---
document.addEventListener("DOMContentLoaded", function() {
    initializeElements();
    setupEventListeners();
    updateUI();

    // 画像モーダル
    const overlay = document.getElementById('image-modal-overlay');
    const closeBtn = document.getElementById('image-modal-close');
    if (overlay && closeBtn) {
        closeBtn.onclick = closeImageModal;
        overlay.onclick = (e) => {
            if (e.target === overlay) closeImageModal();
        };
    }

    // ヘルプモーダル
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal-overlay');
    const helpClose = document.getElementById('help-modal-close');
    if (helpBtn && helpModal && helpClose) {
        helpBtn.onclick = () => helpModal.classList.remove('hidden');
        helpClose.onclick = () => helpModal.classList.add('hidden');
        helpModal.onclick = (e) => {
            if (e.target === helpModal) helpModal.classList.add('hidden');
        };
    }
});