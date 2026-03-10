import { useState } from "react";
import tbjlogo from "@/assets/tbjlogo.png";
import footer from "@/assets/footer.png";

const CORRECT_ANSWERS: Record<number, string> = {
  1: "C", 2: "D", 3: "C", 4: "B", 5: "B",
  6: "C", 7: "B", 8: "B", 9: "B", 10: "B",
};

const QUESTIONS = [
  {
    id: 1,
    text: "Segundo o Decreto nº 001/2026, a exclusão de antecedentes criminais será realizada por meio de:",
    options: ["A) Solicitação administrativa", "B) Pedido na delegacia", "C) Ação judicial", "D) Pedido ao Ministério Público"],
  },
  {
    id: 2,
    text: "Qual órgão possui competência exclusiva para determinar a exclusão de antecedentes criminais?",
    options: ["A) Polícia Militar", "B) Polícia Civil", "C) Ministério Público", "D) Poder Judiciário"],
  },
  {
    id: 3,
    text: "Segundo o Decreto nº 003/2026, a audiência de custódia tem como finalidade principal:",
    options: ["A) Aplicar pena imediatamente ao acusado", "B) Encerrar o processo criminal", "C) Verificar a legalidade da prisão e garantir os direitos do preso", "D) Registrar apenas o boletim de ocorrência"],
  },
  {
    id: 4,
    text: "De acordo com o fluxo legal de prisão estabelecido pelo Decreto nº 006/2026, após a abordagem policial o suspeito deve ser conduzido para:",
    options: ["A) Tribunal de Justiça", "B) Delegacia da Polícia Civil", "C) Ministério Público", "D) Prefeitura"],
  },
  {
    id: 5,
    text: "Utilizar roupas ou acessórios de uso exclusivo policial configura qual infração?",
    options: ["A) Art. 289", "B) Art. 200-A", "C) Art. 333", "D) Art. 19"],
  },
  {
    id: 6,
    text: "Oferecer vantagem indevida a um funcionário público para obter benefício caracteriza qual crime?",
    options: ["A) Desobediência", "B) Desacato", "C) Corrupção (Art. 333)", "D) Denúncia caluniosa"],
  },
  {
    id: 7,
    text: "Desrespeitar ou ofender um funcionário público no exercício de sua função configura:",
    options: ["A) Desobediência", "B) Desacato (Art. 331)", "C) Suborno", "D) Associação criminosa"],
  },
  {
    id: 8,
    text: "Inventar um crime e acusar alguém sabendo que ele é inocente caracteriza:",
    options: ["A) Falsidade ideológica", "B) Denúncia caluniosa (Art. 339)", "C) Corrupção", "D) Associação criminosa"],
  },
  {
    id: 9,
    text: "Portar arma automática sem autorização configura qual crime?",
    options: ["A) Porte ilegal de arma classe 1", "B) Porte ilegal de arma classe 2 (Art. 17)", "C) Tráfico de munições", "D) Tráfico de armas"],
  },
  {
    id: 10,
    text: "Ser flagrado com mais de duas unidades de entorpecentes caracteriza:",
    options: ["A) Porte pessoal", "B) Tráfico de drogas (Art. 33)", "C) Contrabando", "D) Associação criminosa"],
  },
];

const Index = () => {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [idade, setIdade] = useState("");
  const [discord, setDiscord] = useState("");
  const [telefone, setTelefone] = useState("");
  const [interesse, setInteresse] = useState("");
  const [identityLocked, setIdentityLocked] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [discursive1, setDiscursive1] = useState("");
  const [discursive2, setDiscursive2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const lockIdentity = () => {
    if (!nome || !rg || !idade || !discord || !telefone || !interesse) return;
    setIdentityLocked(true);
  };

  const handleAnswer = (qId: number, letter: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: letter }));
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 1; i <= 10; i++) {
      if (answers[i] === CORRECT_ANSWERS[i]) score += 0.5;
    }
    // Discursive questions scored manually — placeholder 0
    return score;
  };

  const handleSubmit = async () => {
    const errs: string[] = [];
    if (!identityLocked) errs.push("Confirme sua identidade antes de prosseguir.");
    for (let i = 1; i <= 10; i++) {
      if (!answers[i]) errs.push(`Questão ${i} não respondida.`);
    }
    if (!discursive1.trim()) errs.push("Questão 11 não respondida.");
    if (!discursive2.trim()) errs.push("Questão 12 não respondida.");

    if (errs.length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0 });
      return;
    }

    setErrors([]);
    setSending(true);

    // Build email body
    const objectiveAnswers = QUESTIONS.map(
      (q) => `${q.id}. ${answers[q.id]}`
    ).join("\n");

    const body = `EXAME OAB BRASILÂNDIA — RESPOSTAS\n\nCANDIDATO\nNome: ${nome}\nRG: ${rg}\nIdade: ${idade}\nDiscord: ${discord}\nTelefone: ${telefone}\nInteresse no Judiciário: ${interesse}\n\nRESPOSTAS OBJETIVAS\n${objectiveAnswers}\n\nQUESTÃO 11 (Discursiva)\n${discursive1}\n\nQUESTÃO 12 (Discursiva)\n${discursive2}\n\nPontuação Objetiva: ${calculateScore()}/5.0`;

    // Send via mailto as simple fallback
    const mailtoLink = `mailto:juliaavancisoares@gmail.com?subject=${encodeURIComponent(`OAB Brasilândia — ${nome}`)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");

    setSending(false);
    setSubmitted(true);
    window.scrollTo({ top: 0 });
  };

  if (submitted) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[800px] px-6 py-12">
          <div className="text-center mb-8">
            <img src={tbjlogo} alt="Tribunal de Justiça de Brasilândia" className="mx-auto h-24 mb-6" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Resultado — Exame OAB Brasilândia</h1>
            <p className="mt-2 text-muted-foreground">Candidato: {nome} | RG: {rg}</p>
          </div>

          <div className="border-t border-gold mb-8" />

          <p className="text-lg font-semibold mb-8">
            Pontuação nas questões objetivas: <span className="text-primary">{score}/5.0</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            As questões discursivas (11 e 12) valem 2,5 pontos cada e serão corrigidas manualmente. A nota total máxima é 10,0 pontos.
          </p>

          <h2 className="font-serif text-2xl font-bold mb-6">Gabarito — Questões Objetivas</h2>

          {QUESTIONS.map((q) => {
            const correct = CORRECT_ANSWERS[q.id];
            const chosen = answers[q.id];
            const isCorrect = chosen === correct;
            return (
              <div key={q.id} className="mb-10">
                <p className="font-semibold mb-2">{q.id}. {q.text}</p>
                {q.options.map((opt) => {
                  const letter = opt.charAt(0);
                  const isThisCorrect = letter === correct;
                  const isThisChosen = letter === chosen;
                  let cls = "block py-1 pl-2 border-l-4 mb-1 ";
                  if (isThisCorrect) cls += "border-correct bg-correct-bg font-semibold";
                  else if (isThisChosen && !isThisCorrect) cls += "border-incorrect bg-incorrect-bg line-through";
                  else cls += "border-transparent";
                  return <span key={letter} className={cls}>{opt}</span>;
                })}
                <p className="text-sm mt-1">
                  Sua resposta: <strong>{chosen}</strong> — {isCorrect ? <span className="text-correct">Correto ✓</span> : <span className="text-incorrect">Incorreto ✗ (Resposta: {correct})</span>}
                </p>
              </div>
            );
          })}

          <h2 className="font-serif text-2xl font-bold mb-4 mt-12">Suas Respostas Discursivas</h2>
          <div className="mb-8">
            <p className="font-semibold mb-1">11. Papel do Poder Judiciário em Brasilândia:</p>
            <p className="bg-secondary p-4 whitespace-pre-wrap">{discursive1}</p>
          </div>
          <div className="mb-8">
            <p className="font-semibold mb-1">12. Procedimento de prisão em flagrante:</p>
            <p className="bg-secondary p-4 whitespace-pre-wrap">{discursive2}</p>
          </div>

          <div className="border-t border-gold mt-12 pt-6">
            <img src={footer} alt="Poder Judiciário — Tribunal de Justiça de Brasilândia" className="mx-auto max-w-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        {/* Header */}
        <div className="text-center mb-6">
          <img src={tbjlogo} alt="Tribunal de Justiça de Brasilândia" className="mx-auto h-28 mb-4" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Edital TJSP — Questionário Jurídico</h1>
          <p className="text-muted-foreground mt-2">Primeira Fase — Exame da Ordem dos Advogados de Brasilândia</p>
        </div>

        <div className="h-px bg-gold mb-8" />

        {/* Info */}
        <div className="mb-10 text-sm text-muted-foreground leading-relaxed">
          <p>A prova contém <strong className="text-foreground">12 questões</strong>: 10 objetivas (peso 0,5 cada = 5,0 pontos) e 2 discursivas (peso 2,5 cada = 5,0 pontos), totalizando <strong className="text-foreground">10,0 pontos</strong>.</p>
        </div>

        {/* Study Material Links */}
        <div className="mb-10">
          <h2 className="font-serif text-xl font-bold mb-3">Material de Estudo</h2>
          <p className="text-sm text-muted-foreground mb-4">Consulte os materiais abaixo antes de realizar a prova:</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://docs.google.com/spreadsheets/d/1uw2MlSJrNCaRr3PQDMa1PFnvEHTLjBuVzg_b_Ib6fJw/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-5 py-2 text-center font-semibold hover:bg-foreground"
            >
              Código Penal e Leis de Trânsito — Brasilândia
            </a>
            <a
              href="https://tropical-tuesday-b20.notion.site/CONSTITUI-O-FEDERAL-DE-BRASIL-NDIA-20e4a70cd2ea80af9b48d4f31a2a4be3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-5 py-2 text-center font-semibold hover:bg-foreground"
            >
              Constituição Federal de Brasilândia
            </a>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="border border-primary bg-incorrect-bg p-4 mb-8">
            <p className="font-semibold text-primary mb-2">Erros encontrados:</p>
            <ul className="list-disc list-inside text-sm text-primary">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {/* Identity Fields */}
        <h2 className="font-serif text-xl font-bold mb-4">Identificação do Candidato</h2>

        <div className="flex flex-col gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nome (in-game)</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              readOnly={identityLocked}
              className={`w-full border px-3 py-2 text-sm outline-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">RG (in-game)</label>
            <input
              type="text"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              readOnly={identityLocked}
              className={`w-full border px-3 py-2 text-sm outline-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Idade (in-game)</label>
            <input
              type="text"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              readOnly={identityLocked}
              className={`w-full border px-3 py-2 text-sm outline-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Discord</label>
            <input
              type="text"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              readOnly={identityLocked}
              className={`w-full border px-3 py-2 text-sm outline-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Telefone (in-game)</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              readOnly={identityLocked}
              className={`w-full border px-3 py-2 text-sm outline-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Qual seu interesse no Judiciário?</label>
            <textarea
              value={interesse}
              onChange={(e) => setInteresse(e.target.value)}
              readOnly={identityLocked}
              rows={3}
              className={`w-full border px-3 py-2 text-sm outline-none resize-none ${identityLocked ? "bg-field-locked" : "bg-background"}`}
            />
          </div>
        </div>

        {!identityLocked ? (
          <button
            onClick={lockIdentity}
            disabled={!nome || !rg || !idade || !discord || !telefone || !interesse}
            className="bg-primary text-primary-foreground px-6 py-2 font-semibold hover:bg-foreground disabled:opacity-40 disabled:cursor-not-allowed mb-4"
          >
            Confirmar Identidade
          </button>
        ) : (
          <p className="italic text-sm text-muted-foreground mb-4">Identidade confirmada. Prossiga para o questionário.</p>
        )}

        {identityLocked && (
          <>
            <div className="h-px bg-gold my-10" />

            {/* Objective Questions */}
            <h2 className="font-serif text-xl font-bold mb-6">Questões Objetivas</h2>
            <p className="text-sm text-muted-foreground mb-8">Cada questão vale 0,5 ponto. Total: 5,0 pontos.</p>

            {QUESTIONS.map((q) => (
              <div key={q.id} className="mb-16">
                <p className="font-semibold mb-3">{q.id}. {q.text}</p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const letter = opt.charAt(0);
                    const selected = answers[q.id] === letter;
                    return (
                      <label
                        key={letter}
                        className={`flex items-center gap-3 cursor-pointer py-1 pl-2 border-l-4 ${selected ? "border-primary font-semibold" : "border-transparent"}`}
                      >
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          checked={selected}
                          onChange={() => handleAnswer(q.id, letter)}
                          className="accent-primary"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="h-px bg-gold my-10" />

            {/* Discursive Questions */}
            <h2 className="font-serif text-xl font-bold mb-6">Questões Discursivas</h2>
            <p className="text-sm text-muted-foreground mb-8">Cada questão vale 2,5 pontos. Total: 5,0 pontos.</p>

            <div className="mb-16">
              <p className="font-semibold mb-3">11. Explique qual é o papel do Poder Judiciário em Brasilândia e qual sua importância para garantir a aplicação das leis e a justiça dentro da cidade.</p>
              <textarea
                value={discursive1}
                onChange={(e) => setDiscursive1(e.target.value)}
                rows={6}
                className="w-full border px-3 py-2 text-sm outline-none resize-none bg-background"
              />
            </div>

            <div className="mb-16">
              <p className="font-semibold mb-3">12. Descreva como funciona o procedimento de uma prisão em flagrante, citando as instituições envolvidas e suas responsabilidades dentro do processo legal.</p>
              <textarea
                value={discursive2}
                onChange={(e) => setDiscursive2(e.target.value)}
                rows={6}
                className="w-full border px-3 py-2 text-sm outline-none resize-none bg-background"
              />
            </div>

            <div className="h-px bg-gold my-10" />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="w-full bg-primary text-primary-foreground py-3 font-semibold text-lg hover:bg-foreground disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar Respostas"}
            </button>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Ao enviar, suas respostas serão registradas e o gabarito será exibido. Esta ação é irreversível.
            </p>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-gold mt-16 pt-6">
          <img src={footer} alt="Poder Judiciário — Tribunal de Justiça de Brasilândia" className="mx-auto max-w-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Index;
