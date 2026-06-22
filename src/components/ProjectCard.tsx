import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type ProjectCardProps = {
  href: string
  title: string
  summary: string
  eyebrow?: string
}

export function ProjectCard({ href, title, summary, eyebrow }: ProjectCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={href} sx={{ height: '100%' }}>
        <CardContent
          sx={{
            minHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 4,
            p: 3
          }}
        >
          <Stack spacing={1.5}>
            {eyebrow ? <Typography variant="overline">{eyebrow}</Typography> : null}
            <Typography component="h3" variant="h3">
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {summary}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'primary.main', fontWeight: 700 }}>
            <Typography variant="body2">Read the deep dive</Typography>
            <ArrowForwardIcon fontSize="small" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
