import {PageContainer} from "@/components/PageContainer";
import {NotionService} from "@/services/notion";
import {notFound} from "next/navigation";
import {NotionToMarkdown} from "notion-to-md";
import ReactMarkdown from "react-markdown";
import {DataSourceObjectResponse} from "@notionhq/client";

interface GenericPageProps {
  params: Promise<{ pageSlug: string }>,
}

const NextImageTag = (props: { src: string; alt: string } & Record<string, never>) => <img {...props} />
//
// <Box
//   sx={{position: "relative", display: "flex", flexDirection: "column"}}
// >
//   <Image {...props} fill  />
// </Box>

const components = {
  "img": NextImageTag
}

export default async function GenericPage({params}: GenericPageProps) {
  const {pageSlug} = await params;
  const notion = NotionService();
  const n2m = new NotionToMarkdown({notionClient: notion});

  const {results} = (await notion.dataSources.query({
    data_source_id: process.env.NOTION_PAGES_DATA_SOURCE_ID!
  })) as { results: DataSourceObjectResponse[] };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const target = results.find(x => (x.properties.slug as never).rich_text[0].plain_text === pageSlug);

  if (!target) {
    throw notFound();
  }

  const metadata = {
    id: target.id,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    title: (target.properties.name as never).title[0].plain_text,
    // tags: getTags(target.properties.Tags.multi_select),
    // description: target.properties.description.rich_text[0].plain_text,
    // date: getToday(target.properties.Date.last_edited_time),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    slug: (target.properties.slug as never).rich_text[0].plain_text,
  };

  const mdblocks = await n2m.pageToMarkdown(target.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  return <PageContainer sx={{'img': {maxWidth: "100%"}}}>
    {/*<h2>{page.metadata.title}</h2>*/}
    {/*<span>{page.metadata.date}</span>*/}
    {/*<p>{page.metadata.tags.join(', ')}</p>*/}
    <ReactMarkdown components={components as never}>{mdString.parent}</ReactMarkdown>
  </PageContainer>
}
