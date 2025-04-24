'use client'

import { AddTransactionDialog } from "@/components/finance/add-transaction"
import { ExpenseChart } from "@/components/finance/expense-chart"
import TransactionTable from "@/components/finance/transaction-table"
import Header from "@/components/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchDailyTransaction, fetchFinanceSummary, fetchTransaction } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { useQuery } from "react-query"
import { DatePickerWithRange } from "@/components/ui/date-picker-range"
import { format, subDays } from "date-fns"

const limitTransactionsItems = [5, 10, 20, 50, 100]

export default function Page() {
  const listBreadcrumb = [
    { title: "Finance", url: "/finance" }
  ]

  const [limitTransaction, setLimitTransaction] = useState(10)
  const [pageTransaction, setPageTransaction] = useState(0)

  const [transationDate, setTransactionDate] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const startDateTransaction = transationDate?.from ? format(transationDate?.from, 'yyyy-MM-dd') : '';
  const endDateTransaction = transationDate?.to ? format(transationDate?.to, 'yyyy-MM-dd') : '';

  const [summaryDate, setSummaryDate] = useState({
    from: new Date(),
    to: new Date(),
  })
  const startDateSummaryTransaction = summaryDate?.from ? format(summaryDate?.from, 'yyyy-MM-dd') : '';
  const endDateSummaryTransaction = summaryDate?.to ? format(summaryDate?.to, 'yyyy-MM-dd') : '';

  const [dailyTransactionDate, setDailyTransactionDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const startDateDailyTransaction = dailyTransactionDate?.from ? format(dailyTransactionDate?.from, 'yyyy-MM-dd') : '';
  const endDateDailyTransaction = dailyTransactionDate?.to ? format(dailyTransactionDate?.to, 'yyyy-MM-dd') : '';

  // console.log("Transaction Date", transationDate, "From", startDateTransaction, "To", endDateTransaction)


  const { data: transaction, refetch: refetchTransaction } = useQuery(
    ["transaction", pageTransaction, limitTransaction, startDateTransaction, endDateTransaction],
    () => fetchTransaction(limitTransaction, pageTransaction, startDateTransaction, endDateTransaction),
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )
  const { data: summary, refetch: refetchSummary } = useQuery(
    ["summary"],
    fetchFinanceSummary,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )
  const { data: dailyTransaction } = useQuery(
    ["dailyTransaction"],
    fetchDailyTransaction,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  console.log("Transactionnn", transaction)
  

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="my-0 sm:mx-10">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Finance</CardTitle>
            <CardDescription>Manage your personal budgeting</CardDescription>
            <div className="mt-2">
              <AddTransactionDialog refetchTransaction={refetchTransaction} refetchSummary={refetchSummary} />
            </div>
          </CardHeader>
          <CardContent className="space-y-12">

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex">
                <DatePickerWithRange date={summaryDate} setDate={setSummaryDate} />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Balance */}
                <Card className="md:col-span-4 w-full shadow-lg shadow-gray-500/70 bg-gradient-to-r from-gray-100 to-white">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className="grid grid-cols-12">
                      <div className="col-span-6 overflow-x-auto">Balance</div>
                      <div className="col-span-6 overflow-x-auto">{formatCurrency(summary?.balance)}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-6 overflow-x-auto">Income</div>
                      <div className="col-span-6 overflow-x-auto">{formatCurrency(summary?.total_income)}</div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-6 overflow-x-auto">Expense</div>
                      <div className="col-span-6 overflow-x-auto">{formatCurrency(summary?.total_expense)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Income */}
                <Card className="md:col-span-4 w-full shadow-lg shadow-blue-500/70 bg-gradient-to-r from-gray-100 to-white">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Income</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    {summary && summary.category_income.map((item, index) => (
                      <div key={index} className="grid grid-cols-12">
                        <div className="col-span-6 overflow-x-auto">{item.category === 'None' ? "General" : item.category}</div>
                        <div className="col-span-6 overflow-x-auto">{formatCurrency(item.income)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Expense */}
                <Card className="md:col-span-4 w-full shadow-lg shadow-red-600/70 bg-gradient-to-r from-gray-100 to-white">
                  <CardHeader>
                    <CardTitle className='text-red-600'>Expense</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    {summary && summary.category_expense.slice(0, 3).map((item, index) => (
                      <div key={index} className="grid grid-cols-12 max-h-20">
                        <div className="col-span-6 overflow-x-auto">{item.category === 'None' ? "General" : item.category}</div>
                        <div className="col-span-6 overflow-x-auto">{formatCurrency(item.expense)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transaction Chart */}
            <Card className="shadow-lg shadow-gray-500/70">
              <CardHeader>
                <div>
                  <CardTitle>Expense History</CardTitle>
                  <CardDescription>See your expense history chart here</CardDescription>
                </div>
                <div className="flex">
                  <DatePickerWithRange date={dailyTransactionDate} setDate={setDailyTransactionDate} />
                </div>
              </CardHeader>
              <CardContent>
                {dailyTransaction && (
                  <>
                    {/* <LineChart data={dailyTransaction} /> */}
                    <ExpenseChart data={dailyTransaction} />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transaction */}
            <Card className="shadow-lg shadow-gray-500/70">
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <CardTitle>Transaction</CardTitle>
                  <CardDescription>Add your personal budgeting transaction</CardDescription>
                  <div className="mt-2">
                    <AddTransactionDialog refetchTransaction={refetchTransaction} refetchSummary={refetchSummary} />
                  </div>
                  <div className="flex">
                    <DatePickerWithRange date={transationDate} setDate={setTransactionDate} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transaction && <TransactionTable offset={limitTransaction*pageTransaction} transaction={transaction.results} refetchTransaction={refetchTransaction} refetchSummary={refetchSummary} />}
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row justify-between space-y-2">
                <div className="rounded rounded-lg border border-0 md:ml-10 px-2 py-1 space-x-2">
                  <span>Limit</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">{limitTransaction}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {limitTransactionsItems.map((limit, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => setLimitTransaction(limit)}
                        >{limit}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">Page {pageTransaction + 1}</div>
                  <div className="isolate flex -space-x-px">
                    <Button
                      className={`rounded-r-none ${transaction?.previous ? '' : 'bg-gray-500 hover:bg-gray-500 '}`}
                      variant="blue"
                      size="sm"
                      disabled={!transaction?.previous}
                      onClick={() => {
                        setPageTransaction(pageTransaction - 1)
                        refetchTransaction()
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      className={`rounded-l-none ${transaction?.next ? '' : 'bg-gray-500 hover:bg-gray-500 '}`}
                      variant="blue"
                      size="sm"
                      disabled={!transaction?.next}
                      onClick={() => {
                        setPageTransaction((prev) => prev + 1)
                        refetchTransaction()
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
          </CardContent>
        </Card>

      </div>
    </div>
  )
}