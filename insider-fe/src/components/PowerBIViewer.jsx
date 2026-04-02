import { Card } from '@/components/ui/card';

export const PowerBIViewer = ({ link }) => {
  if (!link) return <div>Link tidak valid</div>;
  return (
    // <div className="card rounded! w-full aspect-[16/10.7] ">
    <Card className="py-0 w-full aspect-[16/9.7] ">
      <iframe
        src={link}
        className="w-full h-full border-0"
        style={{ touchAction: "none" }}
      ></iframe>
    </Card>
  );
};
