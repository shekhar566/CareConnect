import { MockedImage } from "./image.mock";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string;
  title: string;
  textStyles?: string;
}
const MockMetric = ({ imgUrl, alt, value, title, textStyles }: MetricProps) => {
  return (
    <div className={textStyles}>
      <MockedImage alt={alt} src={imgUrl} />
      {title} {value}
    </div>
  );
};

export { MockMetric };
