import React from 'react';
import { Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './IssueTable';

type ContributionData = {
    name: string,
    numeric: number,
    percentage: number,
}

type IssuesData = {
    title: string,
    url: string,
    tags: {
        name: string,
        color: string,
    }[]
}

type SummaryProps = {
    name: string,
    description: string,
    data: ContributionData[],
    issues: IssuesData[], 
}

type Issue = {
    title: string,
    tags: string[],
}

const columns: ColumnDef<Issue>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "tags",
        header: "Tags",
    },
]

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
      <div className="flex flex-col gap-y-8">
        <h2>{props.name}</h2>

        <p className="p-3 bg-[#4A665A]/[.18] rounded-2xl">
          {props.description}
        </p>

        <div className="flex flex-row gap-x-3 h-full">
          <ChartContainer
            className="w-full h-full bg-[#4A665A]/[.18] rounded-2xl"
            config={chartConfig}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="contributionValue"
                nameKey="name"
              />
              <ChartLegend
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/6 [&>*]:justify-center"
                content={<ChartLegendContent nameKey="name" />}
              />
            </PieChart>
          </ChartContainer>

          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    );
};



export default Summary;