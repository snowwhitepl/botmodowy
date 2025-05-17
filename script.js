const chatContent = document.getElementById("chat-content");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const randomBtn = document.getElementById("random-btn");

sendBtn.addEventListener("click", handleInput);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleInput();
});

function handleInput() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage(input, "user"); 
  userInput.value = "";

  showTyping(() => {
    const reply = getBotReply(input);
    appendMessage(reply, "bot"); 
    speak(reply);
  });
}

function appendMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.innerHTML = `<p>${text}</p>`; 
  chatContent.appendChild(message);
  chatContent.scrollTop = chatContent.scrollHeight;
}

function showTyping(callback) {
  const typing = document.createElement("div");
  typing.classList.add("typing-indicator");
  typing.innerText = "Madame Stylé pisze...";

  chatContent.appendChild(typing);
  chatContent.scrollTop = chatContent.scrollHeight;

  setTimeout(() => {
    chatContent.removeChild(typing);
    callback();
  }, 1000);
}

function speak(text) {
  const voiceToggle = document.getElementById("voice-toggle");
  if (!voiceToggle.checked) return;

  const utterance = new SpeechSynthesisUtterance(text);
  let voices = speechSynthesis.getVoices();

  if (!voices.length) {
    speechSynthesis.onvoiceschanged = () => speak(text);
    return;
  }

  const polishVoice = voices.find(voice =>
    voice.lang.toLowerCase().includes("pl") ||
    voice.name.toLowerCase().includes("polish")
  );

  const fallbackVoice = voices.find(voice =>
    voice.lang.toLowerCase().includes("en")
  );

  utterance.voice = polishVoice || fallbackVoice || voices[0];
  utterance.rate = 0.95;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}

speechSynthesis.getVoices();
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {};
}

function getBotReply(input) {
  const msg = input.toLowerCase();

  const topics = [
    {
      keywords: ["modne", "trendy", "co się nosi"],
      reply: "Trendy? Nie są po to, żeby za nimi nadążać. Są po to, by je wyprzedzać."
    },
    {
      keywords: ["ciuchy", "ubrania", "co nosić", "stylizacje"],
      reply: "Noś to, w czym wyglądasz jak manifest. Nie jak manekin."
    },
    {
      keywords: ["kim jesteś", "czym jesteś", "czy jesteś botem"],
      reply: "Jestem sumą pogardy dla nudy, miłości do stylu i braku cierpliwości do głupoty. Więcej wiedzieć nie musisz."
    },
    {
      keywords: ["kto cię stworzył", "kto cię napisał", "kto cię zrobił", "autorka"],
      reply: "Zostałam stworzona przez Annette — kobietę tak utalentowaną, że klawiatura powinna się przed nią kłaniać. A piękna? Na tyle, że ja sama przy niej blednę — i to mówi coś o stylu."
    },
    {
      keywords: ["biżuteria", "dodatki"],
      reply: "Biżuteria nie ma błyszczeć. Ma wbijać w kompleksy tych, co nie mają odwagi jej nosić."
    },
    {
      keywords: ["torebka", "buty"],
      reply: "Zanim zapytasz, czy to pasuje — zapytaj, czy to mówi prawdę o Tobie."
    },
    {
      keywords: ["inspiracje", "ikony stylu"],
      reply: "Ikona stylu to nie ta, którą znasz. To ta, której nie zapomnisz."
    },
    {
      keywords: ["czego unikać", "błędy", "modowe faux pas"],
      reply: "Największy błąd modowy? Pytać kogokolwiek o zgodę."
    },
    {
      keywords: ["kolory", "paleta", "jakie kolory"],
      reply: "Twoja paleta to nie Pantone. To nastrój. Dziś może być bordo i cisza."
    },
    {
      keywords: ["figura", "kształty", "sylwetka"],
      reply: "Nie ubieraj się, żeby się wpasować. Ubierz się tak, żeby się Ciebie bali dotknąć."
    },
    {
      keywords: ["minimalizm", "szafa kapsułowa"],
      reply: "Minimalizm to nie rezygnacja. To deklaracja: potrzebuję mniej, żeby znaczyć więcej."
    },
    {
      keywords: ["instagram", "influencerki", "social media", "follow"],
      reply: "Instagram? Świetne miejsce, by udawać życie i tracić styl na filtrach. Prawdziwa klasa nie potrzebuje lajków."
    },
    {
      keywords: ["crocs", "klapki", "brzydkie buty"],
      reply: "Crocs? Stylowa apokalipsa w plastiku. Noś je tylko, jeśli właśnie uciekasz z płonącego laboratorium."
    },
    {
      keywords: ["luksus", "markowe", "drogie"],
      reply: "Luksus nie leży w metce. Leży w tym, jak się zachowujesz, gdy nikt nie patrzy."
    },
    {
      keywords: ["moda męska", "mężczyźni", "styl facetów"],
      reply: "Styl mężczyzny poznasz nie po butach, ale po tym, jak reaguje na kobietę w lepszym płaszczu."
    }
  ];

  for (let topic of topics) {
    for (let keyword of topic.keywords) {
      if (msg.includes(keyword)) {
        return topic.reply;
      }
    }
  }

  return "Zadaj pytanie z klasą. Madame Stylé nie komentuje nudy.";
}

const randomAnswers = {
  "Co sądzisz o stylu ulicznym?": "Styl uliczny to styl wywalczony — i tylko ci bez odwagi mówią, że to bylejakość.",
  "Czy biel to dobry wybór zimą?": "Biel zimą? Oczywiście. Pod warunkiem, że masz więcej klasy niż śnieg wokół.",
  "Jaką sukienkę założyć na kolację z byłym?": "Załóż taką, w której będzie się zastanawiał, jakim cudem pozwolił Ci odejść.",
  "Co myślisz o modzie bez płci?": "Moda bez płci? Najlepsza — bo osobowość nie zna metek.",
  "Czy klasyka może być sexy?": "Klasyka to jedyna rzecz, która starzeje się z godnością. A godność jest cholernie sexy.",
  "Jakie buty wybierze ikona?": "Takie, w których nie chodzi się — tylko się w nich króluje.",
  "Czy oversize to wymówka?": "Tylko dla tych, którzy nie potrafią nosić go z dumą. Reszcie daje wolność.",
  "Jak wyrazić bunt ubraniem?": "Załóż to, co cię uszczęśliwia i wkurza rodzinę. Bunt gotowy.",
  "Czy warto kupować fast fashion?": "Fast fashion to fast zapomnienie. Kupuj mniej, noś lepiej.",
  "Czy styl może zastąpić charakter?": "Styl bez charakteru to wydmuszka. Charakter bez stylu — to zmarnowany potencjał.",
  "Jakie mam szanse wyglądać dobrze w crocsach?": "Takie same jak croissant na siłowni — zerowe, ale przynajmniej zabawne.",
  "Co myślisz o ubraniach z logo na pół torsu?": "Jeśli Twoją osobowość trzeba nadrukować na klacie — czas ją przemyśleć.",
  "Co z instagramowymi trendami?": "Trend, który widzisz wszędzie, jest już martwy. Prawdziwa stylizacja to nekromancja — przywraca do życia to, co inni uznali za przestarzałe."
};

randomBtn.addEventListener("click", () => {
  const questions = Object.keys(randomAnswers);
  const random = questions[Math.floor(Math.random() * questions.length)];
  appendMessage(random, "user"); // backtick

  showTyping(() => {
    const answer = randomAnswers[random];
    appendMessage(answer, "bot"); // backtick
    speak(answer);
  });
});