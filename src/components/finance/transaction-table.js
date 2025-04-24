import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ALargeSmall, AlignCenter, ArrowRightLeft, Banknote, Calendar, Pencil, Trash } from "lucide-react";
import { deleteTransaction } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function TransactionTable ({ transaction, refetchTransaction, refetchSummary, offset }) {
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>
            <div className="flex justify-center items-center gap-2">
              <ArrowRightLeft /> Type
            </div>
          </TableHead>
          <TableHead>
            <div className="flex justify-center items-center gap-2">
              <Banknote /> Amount
            </div>
          </TableHead>
          <TableHead>
            <div className="flex justify-center items-center gap-2">
              <AlignCenter /> Category
            </div>
          </TableHead>
          <TableHead>
            <div className="flex justify-center items-center gap-2">
              <Calendar /> Date
            </div>
          </TableHead>
          <TableHead>
            <div className="flex justify-center items-center gap-2">
              <ALargeSmall /> Description
            </div>
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transaction.length > 0 && transaction.map((item, index) => (
          <TableRow key={index} >
            <TableCell>{index+1+offset}</TableCell>
            <TableCell
              className={`font-semibold ${item.type === 'expense' ? 'text-red-600' : 'text-blue-700'}`}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </TableCell>
            <TableCell
              // className={`font-semibold ${item.type === 'expense' ? 'text-red-600' : 'text-blue-700'}`}
              className="font-medium"
            >{formatCurrency(item.amount.split(".")[0])}</TableCell>
            <TableCell>{item.category?.name}</TableCell>
            <TableCell>{format(new Date(item.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="">
              <div className="flex">
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
              </div>
            </TableCell>
          </TableRow>
        ))}
        {/* {transaction.length < 5 && Array.from({ length: 5 - transaction.length }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>{index + transaction.length + offset + 1}</TableCell>
          </TableRow>
        ))} */}
      </TableBody>
    </Table>
  )
} 