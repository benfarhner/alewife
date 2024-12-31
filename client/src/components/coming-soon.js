import { Box } from '@mui/material';

export default function ComingSoon(props) {
  const { batches } = props;

  return (
    <Box pb={4} textAlign="center">
      <span className="tap-coming-soon-heading">
        Coming soon:{' '}
      </span>
      <span className="tap-coming-soon-batches">
        {batches
          .filter(i => i.status == "brewing")
          .sort((a, b) => a.number - b.number)
          .map(i => i.name)
          .join(', ')
        }
      </span>
    </Box>
  )
}