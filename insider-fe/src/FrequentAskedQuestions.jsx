import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";

export default function FrequentAskedQuestions() {
  const faqData = [
    {
      question: "Apakah Insider?",
      answer:
        'Platform Competive Intellegence (CI) TIF "INSIDER" ini didevelop dengan menggunakan digital platform dengan teknologi Artificial Intelligence (AI) dalam melakukan profiling market, serta menggunakan resource IT berupa Power BI Pro, JavaScript Framework, SQL Database serta API Integration dalam Visualisasi data CI tersebut.',
    },
    {
      question: "Apa manfaat Insider?",
      answer:
        "Analyzing Market Profile by Integrated Data Profiling to Enhance TIF Business Positioning in Indonesia.",
    },
  ];

  return (
    <div className=" mx-auto py-6 sm:px-20 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">TIF insider</h1>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Frequent Asked Questions
        </p>
      </div>
      <Card>
        <CardContent>
          <Accordion type="multiple" collapsible>
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
