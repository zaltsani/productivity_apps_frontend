'use client'

import { AddTransactionDialog } from "@/components/finance/add-transaction"
import TransactionTable from "@/components/finance/transaction-table"
import Header from "@/components/headers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDailyTransaction, fetchFinanceSummary, fetchTransaction } from "@/lib/data"
import { useQuery } from "react-query"
import { LineChart } from "@/components/charts/line/line-chart"
import { ExpenseChart } from "@/components/finance/expense-chart"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export default function Page() {
  const listBreadcrumb = [
    { title: "Finance", url: "/finance" }
  ]

  const [limitTransaction, setLimitTransaction] = useState(10)
  const [pageTransaction, setPageTransaction] = useState(0)

  const { data: transaction, refetch: refetchTransaction } = useQuery(
    ["transaction", pageTransaction, limitTransaction],
    () => fetchTransaction(limitTransaction, pageTransaction),
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
  

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <div className="my-0 sm:mx-10">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Finance</CardTitle>
            <CardDescription>Manage your personal budgeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-12">

            <div className="flex flex-col md:flex-row gap-4">

              {/* Summary */}
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

            {/* Transaction Chart */}
            <Card className="shadow-lg shadow-gray-500/70">
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>See your expense history chart here</CardDescription>
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
                </div>
              </CardHeader>
              <CardContent>
                {transaction && <TransactionTable offset={limitTransaction*pageTransaction} transaction={transaction.results} refetchTransaction={refetchTransaction} refetchSummary={refetchSummary} />}
              </CardContent>
              <CardFooter className="justify-end space-x-10">
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
                      // refetchTransaction()
                    }}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
          </CardContent>
        </Card>

      </div>
    </div>
  )
}