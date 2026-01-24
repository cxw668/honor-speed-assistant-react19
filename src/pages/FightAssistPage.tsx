import { HeroRelationshipAnalysis } from '../components/business/HeroRelationshipAnalysis';
import {
  Box,
  Container
} from '@mui/material';
export default function FightAssistPage() {

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 2, md: 4 }, zIndex: 10 }}>
        <Box sx={{ height: '100%' }}>
          <HeroRelationshipAnalysis />
        </Box>
      </Container>
    </Box>
  );
}
