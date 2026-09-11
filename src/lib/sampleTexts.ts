export interface SampleText {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'assignment',
    title: 'College Assignment / Essay',
    category: 'Academic',
    text: `The Renaissance and Humanism

The Renaissance marked a profound cultural rebirth across Europe between the fourteenth and seventeenth centuries. Originating in the bustling merchant city-states of northern Italy, particularly Florence, it bridged the gap between medieval scholasticism and modern inquiry.

Central to this era was the philosophy of Humanism, which emphasized the value of individual potential, secular knowledge, and the revival of classical Greek and Roman literature. Thinkers such as Petrarch and Erasmus advocated for learning based on reason and empirical observation rather than dogmatic acceptance.

Artistic breakthroughs mirrored this intellectual revolution. Masters such as Leonardo da Vinci and Michelangelo mastered linear perspective, anatomical precision, and chiaroscuro, forever transforming European aesthetics. The Renaissance proved that when curiosity meets creative courage, society reshapes its own horizon.`
  },
  {
    id: 'letter',
    title: 'Personal Handwritten Letter',
    category: 'Personal',
    text: `Dearest Eleanor,

I hope this letter finds you wrapped in good health and high spirits. 

The autumn wind has settled into the valley today. The maple leaves outside my study window have turned that brilliant shade of amber and crimson we both love so much. I spent the morning walking down by the old stone bridge, thinking about our conversations last summer.

Time seems to move both too quickly and too slowly when we are apart. I promise to visit as soon as the semester exams wrap up next month. Until then, please take good care of yourself and give my warmest regards to everyone.

With all my love and fondest memories,
Julian`
  },
  {
    id: 'lecture-notes',
    title: 'Class Lecture Notes (Bio 101)',
    category: 'Study Notes',
    text: `BIO 101 — Cellular Respiration & ATP Cycle
Prof. Henderson — Oct 14th

Key Concept: How cells convert glucose into usable biochemical energy (ATP).

1. Glycolysis (in Cytoplasm):
- Anaerobic process (no O2 required).
- 1 Glucose (6-carbon) splits into 2 Pyruvate (3-carbon).
- Net yield: 2 ATP + 2 NADH.

2. Krebs Cycle / Citric Acid Cycle (Mitochondrial Matrix):
- Pyruvate converted to Acetyl-CoA.
- Cycles through oxaloacetate, releasing CO2.
- High-energy electron carriers loaded: NADH and FADH2.

3. Electron Transport Chain & Chemiosmosis (Inner Membrane):
- Proton gradient (H+) pumped across inner membrane.
- ATP Synthase acts like a rotary turbine!
- Yields ~32 to 34 ATP per glucose molecule.

*Exam Note: Remember that oxygen is the final electron acceptor!*`
  },
  {
    id: 'poem',
    title: 'Poem — The Road Not Taken',
    category: 'Literature',
    text: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`
  },
  {
    id: 'todo-list',
    title: 'Weekly Journal & To-Do List',
    category: 'Notes',
    text: `Sunday Evening Review & Weekly Priorities:

[ ] Submit Research Proposal to Dr. Vance by Tuesday 4 PM
[ ] Pick up prescription from Walgreens
[ ] Order replacement fountain pen cartridges (Pilot Royal Blue)
[ ] Schedule dental cleaning checkup for next Thursday
[ ] Read Chapters 7 & 8 of "Thinking, Fast and Slow"
[ ] Call Mom on Wednesday evening

Groceries for the week:
- Sourdough loaf & organic eggs
- Almond milk & Earl Grey tea
- Fresh rosemary, garlic, and cherry tomatoes
- Dark chocolate (72% cacao)`
  }
];
