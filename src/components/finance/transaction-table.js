import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { deleteTransaction } from "@/lib/data";

export default function TransactionTable ({ transaction, refetchTransaction, refetchSummary, offset }) {
  console.log(transaction.length)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transaction.length > 0 && transaction.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index+1+offset}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.category?.name}</TableCell>
            <TableCell>{format(new Date(item.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="space-x-3">
              <Button variant="icon" size='sm'>
                <Pencil />
              </Button>
              <Button
                variant="icon"
                size='sm'
                className=""
                onClick={() => {
                  deleteTransaction(item)
                  refetchTransaction()
                  refetchSummary()
                }}
              >
                <Trash className="text-red-600" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {transaction.length < 5 && Array.from({ length: 5 - transaction.length }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>{index + transaction.length + offset + 1}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 