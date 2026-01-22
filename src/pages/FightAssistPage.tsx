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
      <Container maxWidth="lg" sx={{ flex: 1,  overflowY: 'auto', py: { md: 4, sm: 2 },zIndex: 10 }}>
        <Box>
          <HeroRelationshipAnalysis />
        </Box>
      </Container>
    </Box>
  );
}
