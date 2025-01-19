import React from 'react';
import { Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

type ContributionData = {
    name: string,
    numeric: number,
    percentage: number,
}

type SummaryProps = {
    name: string,
    description: string,
    data: ContributionData[],
}

const COLORS = ["#FAC8CD", "#D7BCC8", "#98B6B1", "#629677", "#495D63", "#59C3C3", "#52489C", "#84A98C", "#484538"]

const Summary: React.FC<SummaryProps> = (props: SummaryProps) => {
    let data = props.data.sort((a, b) => b.percentage - a.percentage);
    if (data.length > 10) {
        const percentageSum = data.slice(10).reduce((acc, curr) => acc + curr.percentage, 0);
        const numericSum = data.slice(10).reduce((acc, curr) => acc + curr.numeric, 0);
        data = [
            ...data.slice(0, 10),
            { name: "Others", numeric: numericSum, percentage: percentageSum}
        ]
    }
    // const chartData = [
    //     { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    //     { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    //     { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    //     { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    //     { browser: "other", visitors: 90, fill: "var(--color-other)" },
    //   ]
      
    //   const chartConfig = {
    //     visitors: {
    //       label: "Visitors",
    //     },
    //     chrome: {
    //       label: "Chrome",
    //       color: "hsl(var(--chart-1))",
    //     },
    //     safari: {
    //       label: "Safari",
    //       color: "hsl(var(--chart-2))",
    //     },
    //     firefox: {
    //       label: "Firefox",
    //       color: "hsl(var(--chart-3))",
    //     },
    //     edge: {
    //       label: "Edge",
    //       color: "hsl(var(--chart-4))",
    //     },
    //     other: {
    //       label: "Other",
    //       color: "hsl(var(--chart-5))",
    //     },
    //   } satisfies ChartConfig

    const chartData = data.map((d, i) => ({
        name: d.name,
        contributionValue: d.numeric,
        contributionPercentage: d.percentage,
        fill: COLORS[i % COLORS.length] 
    }));

    let chartConfig: Record<string, Object> = {
        contributionValue: {
            label: "Contributions",
        },
        contributionPercentage: {
            label: "Contributions",
        },
    } satisfies ChartConfig;
    chartData.forEach((d) => {
        chartConfig[d.name] = {
            label: d.name,
            color: d.fill,
        }
    });

    return (
      <div className='flex flex-col gap-y-8'>
        <h2>{props.name}</h2>

        <p className="p-3 bg-[#4A665A]/[.18] rounded-2xl">
          {props.description}
        </p>

        <div className='flex flex-row gap-x-3 h-full'>
            <ChartContainer className="w-full h-full bg-[#4A665A]/[.18] rounded-2xl" config={chartConfig}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={chartData} dataKey="contributionValue" nameKey="name" />
                <ChartLegend
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/6 [&>*]:justify-center"
                  content={<ChartLegendContent nameKey="name" />}
                />
              </PieChart>
            </ChartContainer>

            <div className='w-full h-full bg-[#4A665A]/[.18] rounded-2xl'>

            </div>
        </div>
      </div>
    );
};



export default Summary;