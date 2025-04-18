import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { addCategory, addTransaction, fetchCategory, fetchMe } from "@/lib/data"
import { useQuery } from "react-query"
import { DateTimePicker } from "../ui/date-time-picker"
import { Plus } from "lucide-react"

export const AddTransactionDialog = ({ refetchTransaction, refetchSummary }) => {
  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState()
  const [category, setCategory] = useState(null)
  const [date, setDate] = useState(null)
  const [description, setDesciption] = useState(null)
  const [inputCategory, setInputCategory] = useState(null)

  const { data: categories, refetch: refetchCategories } = useQuery(
    ["categories"], 
    fetchCategory,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  // console.log("type", type, "amount", amount, "category", category, "date", date, "description", description)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="blue"
        >
          <Plus /> Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-2">

          {/* Type */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">Type</div>
            <div className="col-span-8">
              <Select onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">Amount</div>
            <div className="col-span-8">
              <Input
                id="amount"
                defaultValue={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">Category</div>
            <div className="col-span-8">
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories && categories.map((item, index) => (
                      <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                    ))}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="relative flex w-full hover:bg-gray-200 cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          Add Category
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Category</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-4">Name</div>
                          <Input
                            id="input-category"
                            defaultValue={inputCategory}
                            type="text"
                            onChange={(e) => setInputCategory(e.target.value)}
                            className="col-span-8"
                          />
                        </div>

                        <DialogFooter>
                          <DialogTrigger asChild>
                            <Button
                              type="submit"
                              onClick={async() => {
                                const me = await fetchMe()
                                addCategory(me, inputCategory)
                                refetchCategories()
                              }}
                            >
                              Add Category
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">Date</div>
            <div className="col-span-8">
              <DateTimePicker value={date} onChange={setDate} className="w-[280px]" />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">Description</div>
            <div className="col-span-8">
              <Input
                id="description"
                defaultValue={description}
                type="text"
                onChange={(e) => setDesciption(e.target.value)}
              />
            </div>
          </div>

        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              type="submit"
              onClick={async() => {
                const me = await fetchMe()
                const data = {
                  user: me.id,
                  amount: amount,
                  type: type,
                  date: date,
                  description: description,
                  category: category
                }
                addTransaction(data)
                refetchTransaction()
                refetchSummary()
              }}
            >
              Add Transaction
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}