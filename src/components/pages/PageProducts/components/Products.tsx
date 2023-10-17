import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatAsPrice } from '~/utils/utils';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import { useProducts } from '~/queries/products';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Products() {
  const { data = [], isLoading } = useProducts();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {data.map(({ ...product }, index) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardMedia
              sx={{ pt: '56.25%' }}
              image={`https://source.unsplash.com/random?sig=${index}`}
              title='Image title'
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant='h5' component='h2'>
                {product.title}
              </Typography>
              <Typography>{formatAsPrice(product.price)}</Typography>
              <Typography gutterBottom paragraph={true}>
                {product.description}
              </Typography>
              <Typography variant='subtitle1'>
                Author: <b>{product.author}</b>
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Weight</TableCell>
                      <TableCell component='th' scope='row'>
                        {product.weight}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Players</TableCell>
                      <TableCell>{product.players}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Available count</TableCell>
                      <TableCell>{product.count || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            {/*             <CardActions> */}
            {/*               <AddProductToCart product={product} /> */}
            {/*             </CardActions> */}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
